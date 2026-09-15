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
        [51, 53, 55, 56, 57].includes(code)
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
    const [temperature, setTemperature] =
        useState(null)

    const [weatherCode, setWeatherCode] =
        useState(null)
    
    const [cloudCover, setCloudCover] =
        useState(null)

    const [status, setStatus] =
        useState('loading')

    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus('error')
            return
        }

        const loadWeather = () => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const {
                            latitude,
                            longitude,
                        } = position.coords

                        console.log('Latitude:', latitude)
                        console.log('Longitude:', longitude)
                        console.log(
                            'Precisão:',
                            position.coords.accuracy,
                            'metros',
                        )

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

                        setTemperature(
                            data.current.temperature_2m.toFixed(1),
                        )

                        setWeatherCode(
                            data.current.weather_code,
                        )

                        setCloudCover(
                            data.current.cloud_cover,
                        )

                        setStatus('success')
                    } catch {
                        setStatus('error')
                    }
                },

                () => {
                    setStatus('error')
                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                },
            )
        }

        loadWeather()

        const interval = setInterval(
            loadWeather,
            10 * 60 * 1000,
        )

        return () => {
            clearInterval(interval)
        }
    }, [])

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
                title="Localização indisponível"
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