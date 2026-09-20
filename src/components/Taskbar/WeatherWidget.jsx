import {
    useEffect,
    useState,
} from 'react'

import './WeatherWidget.css'


/* === CONFIGURAÇÃO === */
const WEATHER_REFRESH_INTERVAL =
    10 * 60 * 1000

const GEOLOCATION_TIMEOUT =
    10 * 1000


/* === ÍCONE DO CLIMA === */
const getWeatherEmoji = (
    code,
    cloudCover,
) => {
    if (
        [95, 96, 99].includes(
            code,
        )
    ) {
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

    if (
        [45, 48].includes(
            code,
        )
    ) {
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

    if (
        cloudCover >= 80
    ) {
        return '☁️'
    }

    if (
        cloudCover >= 50
    ) {
        return '🌥️'
    }

    if (
        cloudCover >= 20
    ) {
        return '🌤️'
    }

    return '☀️'
}


function WeatherWidget() {
    const geolocationSupported =
        typeof navigator !==
        'undefined' &&
        Boolean(
            navigator.geolocation,
        )


    /* === ESTADO === */
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
    ] = useState(0)

    const [
        status,
        setStatus,
    ] = useState(
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


    /* === CARREGAMENTO DO CLIMA === */
    useEffect(() => {
        if (
            !geolocationSupported
        ) {
            return
        }

        let cancelled =
            false

        let refreshInterval =
            null

        let requestController =
            null


        const loadWeather = async (
            latitude,
            longitude,
        ) => {
            requestController?.abort()

            requestController =
                new AbortController()

            try {
                const url =
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,cloud_cover&timezone=auto`

                const response =
                    await fetch(
                        url,
                        {
                            signal:
                                requestController.signal,
                        },
                    )

                if (
                    !response.ok
                ) {
                    throw new Error(
                        `Erro HTTP ${response.status}`,
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

                if (
                    cancelled
                ) {
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

                setErrorMessage(
                    '',
                )

                setStatus(
                    'success',
                )
            } catch (error) {
                if (
                    cancelled ||
                    error.name ===
                    'AbortError'
                ) {
                    return
                }

                setErrorMessage(
                    'Clima indisponível',
                )

                setStatus(
                    'error',
                )
            }
        }


        /* ----- LOCALIZAÇÃO ----- */
        navigator.geolocation
            .getCurrentPosition(
                (position) => {
                    if (
                        cancelled
                    ) {
                        return
                    }

                    const {
                        latitude,
                        longitude,
                    } =
                        position.coords

                    loadWeather(
                        latitude,
                        longitude,
                    )

                    refreshInterval =
                        setInterval(
                            () => {
                                loadWeather(
                                    latitude,
                                    longitude,
                                )
                            },
                            WEATHER_REFRESH_INTERVAL,
                        )
                },

                (error) => {
                    if (
                        cancelled
                    ) {
                        return
                    }

                    switch (
                    error.code
                    ) {
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

                    setStatus(
                        'error',
                    )
                },

                {
                    enableHighAccuracy:
                        false,

                    timeout:
                        GEOLOCATION_TIMEOUT,

                    maximumAge:
                        WEATHER_REFRESH_INTERVAL,
                },
            )


        /* ----- LIMPEZA ----- */
        return () => {
            cancelled =
                true

            requestController?.abort()

            if (
                refreshInterval
            ) {
                clearInterval(
                    refreshInterval,
                )
            }
        }
    }, [
        geolocationSupported,
    ])


    /* === RENDERIZAÇÃO === */
    if (
        status === 'loading'
    ) {
        return (
            <div
                className="weather-widget"
                title="Carregando clima..."
                aria-label="Carregando clima"
            >
                <span
                    aria-hidden="true"
                >
                    🌡️
                </span>

                <span>
                    --°
                </span>
            </div>
        )
    }

    if (
        status === 'error'
    ) {
        return (
            <div
                className="weather-widget"
                title={
                    errorMessage
                }
                aria-label={
                    errorMessage
                }
            >
                <span
                    aria-hidden="true"
                >
                    🌡️
                </span>

                <span>
                    --°
                </span>
            </div>
        )
    }

    const weatherEmoji =
        getWeatherEmoji(
            weatherCode,
            cloudCover,
        )

    return (
        <div
            className="weather-widget"
            title="Clima da sua localização"
            aria-label={
                `Temperatura atual: ${temperature} graus Celsius`
            }
        >
            <span
                className="weather-widget-emoji"
                aria-hidden="true"
            >
                {weatherEmoji}
            </span>

            <span className="weather-widget-temperature">
                {temperature}°
            </span>
        </div>
    )
}

export default WeatherWidget