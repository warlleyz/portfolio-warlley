import {
    useEffect,
    useState,
} from 'react'

import Tooltip from '../Tooltip/Tooltip'

import './WeatherWidget.css'


/* === CONFIGURAÇÃO === */
const WEATHER_REFRESH_INTERVAL =
    10 * 60 * 1000

const GEOLOCATION_TIMEOUT =
    10 * 1000

const LOCATION_ERROR_KEY =
    'ws-weather-location-error'


/* === ARMAZENAMENTO DA SESSÃO === */
function getStoredLocationError() {
    try {
        return sessionStorage.getItem(
            LOCATION_ERROR_KEY,
        )
    } catch {
        return null
    }
}


function storeLocationError(
    message,
) {
    try {
        sessionStorage.setItem(
            LOCATION_ERROR_KEY,
            message,
        )
    } catch {
        // O widget continua funcionando sem persistência.
    }
}


function clearStoredLocationError() {
    try {
        sessionStorage.removeItem(
            LOCATION_ERROR_KEY,
        )
    } catch {
        // O widget continua funcionando sem persistência.
    }
}


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
        ].includes(
            code,
        )
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
        ].includes(
            code,
        )
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
        ].includes(
            code,
        )
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


/* === ERRO DE LOCALIZAÇÃO === */
function getGeolocationErrorMessage(
    error,
) {
    switch (
    error.code
    ) {
        case error.PERMISSION_DENIED:
            return 'Localização bloqueada'

        case error.POSITION_UNAVAILABLE:
            return 'Localização indisponível'

        case error.TIMEOUT:
            return 'Tempo limite da localização'

        default:
            return 'Erro de localização'
    }
}


function WeatherWidget() {
    /* === SUPORTE === */
    const geolocationSupported =
        typeof navigator !==
        'undefined' &&
        Boolean(
            navigator.geolocation,
        )


    /* === ERRO INICIAL DA SESSÃO === */
    const [
        initialLocationError,
    ] = useState(
        () =>
            getStoredLocationError(),
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
        () =>
            geolocationSupported &&
                !initialLocationError
                ? 'loading'
                : 'error',
    )

    const [
        errorMessage,
        setErrorMessage,
    ] = useState(
        () =>
            initialLocationError ??
            (
                geolocationSupported
                    ? ''
                    : 'Geolocalização não suportada'
            ),
    )


    /* === CARREGAMENTO DO CLIMA === */
    useEffect(() => {
        if (
            !geolocationSupported ||
            initialLocationError
        ) {
            return
        }

        let cancelled =
            false

        let refreshInterval =
            null

        let requestController =
            null


        /* ----- CONSULTAR CLIMA ----- */
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
                (
                    position,
                ) => {
                    if (
                        cancelled
                    ) {
                        return
                    }

                    clearStoredLocationError()

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

                (
                    error,
                ) => {
                    if (
                        cancelled
                    ) {
                        return
                    }

                    const message =
                        getGeolocationErrorMessage(
                            error,
                        )

                    storeLocationError(
                        message,
                    )

                    setErrorMessage(
                        message,
                    )

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
        initialLocationError,
    ])


    /* === CARREGANDO === */
    if (
        status === 'loading'
    ) {
        return (
            <Tooltip
                text="Carregando clima..."
                position="top"
            >
                <div
                    className="weather-widget"
                    aria-label="Carregando clima"
                >
                    <span
                        className="weather-widget-emoji"
                        aria-hidden="true"
                    >
                        🌡️
                    </span>

                    <span className="weather-widget-temperature">
                        --°
                    </span>
                </div>
            </Tooltip>
        )
    }


    /* === ERRO === */
    if (
        status === 'error'
    ) {
        return (
            <Tooltip
                text={
                    errorMessage
                }
                position="top"
            >
                <div
                    className="weather-widget"
                    aria-label={
                        errorMessage
                    }
                >
                    <span
                        className="weather-widget-emoji"
                        aria-hidden="true"
                    >
                        🌡️
                    </span>

                    <span className="weather-widget-temperature">
                        --°
                    </span>
                </div>
            </Tooltip>
        )
    }


    /* === CLIMA === */
    const weatherEmoji =
        getWeatherEmoji(
            weatherCode,
            cloudCover,
        )


    /* === RENDERIZAÇÃO === */
    return (
        <Tooltip
            text="Clima da sua localização"
            position="top"
        >
            <div
                className="weather-widget"
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
        </Tooltip>
    )
}


export default WeatherWidget