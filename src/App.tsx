import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {StyledApp, StyledSliders, StyledSlidersSlider} from "./App.styled";
import Slider, { Range } from 'rc-slider';
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

const App = () => {

    const  [APIUrl, setAPIUrl] = useState("https://js-developer-second-round.herokuapp.com/api/v1/application")
    const  [sliderDefaults, setSliderDefaults] = useState<ISliderDefaults>({
        "amountInterval": {
            "min": 10,
            "max": 2000,
            "step": 10,
            "defaultValue": 0
        },
        "termInterval": {
            "min": 3,
            "max": 30,
            "step": 1,
            "defaultValue": 15
        },
        "allAmountOptions": [0],
        "allTermOptions": [0]
    })
    const  [sliderDefaultsLoaded, setSliderDefaultsLoaded] = useState(false)
    const  [sliderAmountValue, setSliderAmountValue] = useState(0)
    const  [sliderTermValue, setSliderTermValue] = useState(0)

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
                setSliderDefaultsLoaded(true)
                console.log("updated")
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }, [])


    return (
        <StyledApp>
            <p>Simple loan calculator</p>
            {sliderDefaultsLoaded && (
                <>
                <StyledSliders>
                    <select value={sliderAmountValue} onChange={(e) => setSliderAmountValue(Number(e.target.value))}>
                        {sliderDefaults.allAmountOptions.map((option, index) => (
                            <option key={index}>{option}</option>
                        ))}
                    </select>
                    <StyledSlidersSlider>
                        <span>Amount</span>
                        <Slider min={sliderDefaults.amountInterval.min} max={sliderDefaults.amountInterval.max} step={sliderDefaults.amountInterval.step} value={sliderAmountValue} defaultValue={sliderDefaults.amountInterval.defaultValue} onChange={(value) => setSliderAmountValue(value)} />
                    </StyledSlidersSlider>
                    <select value={sliderTermValue} onChange={(e) => setSliderTermValue(Number(e.target.value))}>
                        {sliderDefaults.allTermOptions.map((option, index) => (
                            <option key={index}>{option}</option>
                        ))}
                    </select>
                    <StyledSlidersSlider>
                        <span>Term</span>
                        <Slider min={sliderDefaults.termInterval.min} max={sliderDefaults.termInterval.max} step={sliderDefaults.termInterval.step} value={sliderTermValue} defaultValue={sliderDefaults.termInterval.defaultValue} onChange={(value) => setSliderTermValue(value)} />
                    </StyledSlidersSlider>
                </StyledSliders>
                </>
            )}
        </StyledApp>
    );
}

export default App;
