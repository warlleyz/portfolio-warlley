import {
    useEffect,
    useState,
} from 'react'

import './WeatherWidget.css'

const getWeatherEmoji = (
    code,
    cloudCover,
) => {
    if ([95, 96, 99].includes(code)) {
        return '⛈️'
    }

    if (
        [
            61,
            63,
            65,
            66,
            67,
            80,
            81,
            82,
        ].includes(code)
    ) {
        return '🌧️'
    }

    if (
        [
            71,
            73,
            75,
            77,
            85,
            86,
        ].includes(code)
    ) {
        return '🌨️'
    }

    if ([45, 48].includes(code)) {
        return '🌫️'
    }

    if (
        [
            51,
            53,
            55,
            56,
            57,
        ].includes(code)
    ) {
        return '🌦️'
    }

    if (cloudCover >= 80) {
        return '☁️'
    }

    if (cloudCover >= 50) {
        return '🌥️'
    }

    if (cloudCover >= 20) {
        return '🌤️'
    }

    return '☀️'
}

function WeatherWidget() {
    const geolocationSupported =
        typeof navigator !== 'undefined' &&
        Boolean(
            navigator.geolocation,
        )

    const [
        temperature,
        setTemperature,
    ] = useState(null)

    const [
        weatherCode,
        setWeatherCode,
    ] = useState(null)

    const [
        cloudCover,
        setCloudCover,
    ] = useState(null)

    const [status, setStatus] =
        useState(
            geolocationSupported
                ? 'loading'
                : 'error',
        )

    const [
        errorMessage,
        setErrorMessage,
    ] = useState(
        geolocationSupported
            ? ''
            : 'Geolocalização não suportada',
    )

    useEffect(() => {
        if (!geolocationSupported) {
            return
        }

        let interval = null
        let cancelled = false

        const loadWeather = async (
            latitude,
            longitude,
        ) => {
            try {
                const url =
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,cloud_cover&timezone=auto`

                const response =
                    await fetch(url)

                if (!response.ok) {
                    throw new Error(
                        'Erro ao carregar clima',
                    )
                }

                const data =
                    await response.json()

                const current =
                    data?.current

                if (
                    !current ||
                    typeof current.temperature_2m !==
                    'number'
                ) {
                    throw new Error(
                        'Dados climáticos inválidos',
                    )
                }

                if (cancelled) {
                    return
                }

                setTemperature(
                    current.temperature_2m
                        .toFixed(1),
                )

                setWeatherCode(
                    current.weather_code ??
                    null,
                )

                setCloudCover(
                    current.cloud_cover ??
                    0,
                )

                setErrorMessage('')
                setStatus('success')
            } catch (error) {
                if (cancelled) {
                    return
                }

                console.error(
                    'Erro ao carregar clima:',
                    error,
                )

                setErrorMessage(
                    'Clima indisponível',
                )

                setStatus('error')
            }
        }

        navigator.geolocation
            .getCurrentPosition(
                (position) => {
                    const {
                        latitude,
                        longitude,
                    } = position.coords

                    loadWeather(
                        latitude,
                        longitude,
                    )

                    interval =
                        setInterval(() => {
                            loadWeather(
                                latitude,
                                longitude,
                            )
                        }, 10 * 60 * 1000)
                },

                (error) => {
                    if (cancelled) {
                        return
                    }

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setErrorMessage(
                                'Localização bloqueada',
                            )
                            break

                        case error.POSITION_UNAVAILABLE:
                            setErrorMessage(
                                'Localização indisponível',
                            )
                            break

                        case error.TIMEOUT:
                            setErrorMessage(
                                'Tempo limite da localização',
                            )
                            break

                        default:
                            setErrorMessage(
                                'Erro de localização',
                            )
                    }

                    setStatus('error')
                },

                {
                    enableHighAccuracy:
                        false,

                    timeout:
                        10000,

                    maximumAge:
                        10 * 60 * 1000,
                },
            )

        return () => {
            cancelled = true

            if (interval) {
                clearInterval(
                    interval,
                )
            }
        }
    }, [geolocationSupported])

    if (status === 'loading') {
        return (
            <div
                className="weather-widget"
                title="Carregando clima..."
            >
                <span>🌡️</span>
                <span>--°</span>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div
                className="weather-widget"
                title={errorMessage}
            >
                <span>🌡️</span>
                <span>--°</span>
            </div>
        )
    }

    return (
        <div
            className="weather-widget"
            title="Clima da sua localização"
        >
            <span className="weather-widget-emoji">
                {getWeatherEmoji(
                    weatherCode,
                    cloudCover,
                )}
            </span>

            <span className="weather-widget-temperature">
                {temperature}°
            </span>
        </div>
    )
}

export default WeatherWidget