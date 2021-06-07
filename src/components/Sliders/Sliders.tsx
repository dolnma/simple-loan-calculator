import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {StyledApiResults, StyledSliders, StyledSlidersSlider} from "./Sliders.styled";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface ISliderDefaults {
    "amountInterval": {
        "min": number,
        "max": number,
        "step": number,
        "defaultValue": number
    },
    "termInterval": {
        "min": number,
        "max": number,
        "step": number,
        "defaultValue": number
    },
    "allAmountOptions": [number],
    "allTermOptions": [number]
}

interface ISliderValues {
    "totalPrincipal": number
    "term": number
    "totalCostOfCredit": number
    "totalRepayableAmount": number
    "monthlyPayment": number
}


const Sliders = () => {

    const  [APIUrl, setAPIUrl] = useState("https://js-developer-second-round.herokuapp.com/api/v1/application")
    const  [sliderDefaults, setSliderDefaults] = useState<ISliderDefaults>({
        "amountInterval": {
            "min": 0,
            "max": 0,
            "step": 0,
            "defaultValue": 0
        },
        "termInterval": {
            "min": 0,
            "max": 0,
            "step": 0,
            "defaultValue": 0
        },
        "allAmountOptions": [0],
        "allTermOptions": [0]
    })
    const  [sliderDefaultsLoaded, setSliderDefaultsLoaded] = useState(false)
    const  [sliderAmountValue, setSliderAmountValue] = useState(0)
    const  [sliderTermValue, setSliderTermValue] = useState(0)

    const  [sliderValuesApi, setSliderValuesApi] = useState({
        "totalPrincipal": 0,
        "term": 0,
        "totalCostOfCredit": 0,
        "totalRepayableAmount": 0,
        "monthlyPayment": 0
    })
    const  [sliderValuesRealtimeApi, setSliderValuesRealtimeApi] = useState({
        "totalPrincipal": 0,
        "term": 0,
        "totalCostOfCredit": 0,
        "totalRepayableAmount": 0,
        "monthlyPayment": 0
    })

    function generateRange(min: number, max: number, step: number){
        const arr = [];
        for(let i = min; i <= max; i += step){
            arr.push(i);
        }

        return arr;
    }

    useEffect(() => {
        axios.get(APIUrl + '/constraints')
            .then(function (response) {
                setSliderDefaults(prevState => ({...prevState, ...response.data, allAmountOptions: generateRange(response.data.amountInterval.min, response.data.amountInterval.max, response.data.amountInterval.step), allTermOptions: generateRange(response.data.termInterval.min, response.data.termInterval.max, response.data.termInterval.step)}))
                setSliderAmountValue(response.data.amountInterval.defaultValue)
                setSliderTermValue(response.data.termInterval.defaultValue)
                setSliderDefaultsLoaded(true)
                handleChangeToApi(response.data.amountInterval.defaultValue, response.data.termInterval.defaultValue).then((res) =>
                    setSliderValuesApi(res)
                )
                handleChangeToRealtimeApi(response.data.amountInterval.defaultValue, response.data.termInterval.defaultValue).then((res) =>
                    setSliderValuesRealtimeApi(res)
                )
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }, [])


    async function handleChangeToApi<ISliderValues>(amountValue: number, termValue: number) {
        const res = await axios.get(APIUrl + '/first-loan-offer', { params: { amount: amountValue, term: termValue } })
        try {
            return res.data
        } catch (error) {
            console.error(error)
        }
    }

    async function handleChangeToRealtimeApi<ISliderValues>(amountValue: number, termValue: number) {
        const res = await axios.get(APIUrl + '/real-first-loan-offer', { params: { amount: amountValue, term: termValue } })
        try {
            return res.data
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <h1>Simple loan calculator</h1>
            {sliderDefaultsLoaded && (
                <>
                    <StyledSliders>
                        <select value={sliderAmountValue} onChange={(e) => {
                            setSliderAmountValue(Number(e.target.value))
                            handleChangeToApi(Number(e.target.value), sliderTermValue).then((res) =>
                                setSliderValuesApi(res)
                            )
                            handleChangeToRealtimeApi(Number(e.target.value), sliderTermValue).then((res) =>
                                setSliderValuesRealtimeApi(res)
                            )
                        }}>
                            {sliderDefaults.allAmountOptions.map((option, index) => (
                                <option key={index}>{option}</option>
                            ))}
                        </select>
                        <StyledSlidersSlider>
                            <span>Amount</span>
                            <Slider min={sliderDefaults.amountInterval.min} max={sliderDefaults.amountInterval.max} step={sliderDefaults.amountInterval.step} value={sliderAmountValue} defaultValue={sliderDefaults.amountInterval.defaultValue} onChange={(value) => {
                                setSliderAmountValue(value)
                                handleChangeToApi(Number(value), sliderTermValue).then((res) =>
                                    setSliderValuesApi(res)
                                )
                                handleChangeToRealtimeApi(Number(value), sliderTermValue).then((res) =>
                                    setSliderValuesRealtimeApi(res)
                                )
                            }} />
                        </StyledSlidersSlider>
                        <select value={sliderTermValue} onChange={(e) => {
                            setSliderTermValue(Number(e.target.value))
                            handleChangeToApi(sliderAmountValue, Number(e.target.value)).then((res) =>
                                setSliderValuesApi(res)
                            )
                            handleChangeToRealtimeApi(sliderAmountValue, Number(e.target.value)).then((res) =>
                                setSliderValuesRealtimeApi(res)
                            )
                        }}>
                            {sliderDefaults.allTermOptions.map((option, index) => (
                                <option key={index}>{option}</option>
                            ))}
                        </select>
                        <StyledSlidersSlider>
                            <span>Term</span>
                            <Slider min={sliderDefaults.termInterval.min} max={sliderDefaults.termInterval.max} step={sliderDefaults.termInterval.step} value={sliderTermValue} defaultValue={sliderDefaults.termInterval.defaultValue} onChange={(value) => {
                                setSliderTermValue(value)
                                handleChangeToApi(sliderAmountValue, Number(value)).then((res) =>
                                    setSliderValuesApi(res)
                                )
                                handleChangeToRealtimeApi(sliderAmountValue, Number(value)).then((res) =>
                                    setSliderValuesRealtimeApi(res)
                                )
                            }} />
                        </StyledSlidersSlider>
                    </StyledSliders>
                </>
            )}
            {sliderValuesApi && (
                <StyledApiResults>
                    <li><strong>monthlyPayment</strong>: {sliderValuesApi.monthlyPayment}</li>
                    <li><strong>term</strong>: {sliderValuesApi.term}</li>
                    <li><strong>totalCostOfCredit</strong>: {sliderValuesApi.totalCostOfCredit}</li>
                    <li><strong>totalPrincipal</strong>: {sliderValuesApi.totalPrincipal}</li>
                    <li><strong>totalRepayableAmount</strong>: {sliderValuesApi.totalRepayableAmount}</li>
                </StyledApiResults>
            )}
            <h2>Realtime Api</h2>
            {sliderValuesRealtimeApi && (
                <StyledApiResults>
                    <li><strong>monthlyPayment</strong>: {sliderValuesRealtimeApi.monthlyPayment}</li>
                    <li><strong>term</strong>: {sliderValuesRealtimeApi.term}</li>
                    <li><strong>totalCostOfCredit</strong>: {sliderValuesRealtimeApi.totalCostOfCredit}</li>
                    <li><strong>totalPrincipal</strong>: {sliderValuesRealtimeApi.totalPrincipal}</li>
                    <li><strong>totalRepayableAmount</strong>: {sliderValuesRealtimeApi.totalRepayableAmount}</li>
                </StyledApiResults>
            )}
        </>
    );
}

export default Sliders;
