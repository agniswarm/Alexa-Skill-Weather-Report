import {
    ErrorHandler,
    HandlerInput,
    RequestHandler,
    SkillBuilders,
} from 'ask-sdk-core';
import {
    Response,
    SessionEndedRequest,
} from 'ask-sdk-model';

import WeatherReport from './lib/api'
const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        console.log(handlerInput.requestEnvelope.request)
        const speechText = 'Welcome to the Alexa Weather Report';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Weather Report ', speechText)
            .getResponse();
    },
};

const WeatherReportIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'WeatherForcast';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        let gotPlace = "Kolkata"
        const request: any = handlerInput.requestEnvelope.request
        let place = request.intent.slots.place
        if (place && place.value)
            gotPlace = place.value
        let temperature = await WeatherReport.getTemperature(gotPlace)
        let speechText = `The weather at ${gotPlace} is ${temperature} degree celcius`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Weather Report', speechText)
            .getResponse();
    },
};

const HelpIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'You ask for weather at a place, for example: What is the temperature in Kolkata?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Weather Report', speechText)
            .getResponse();
    },
};
const CancelAndStopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = 'Goodbye! Have a plesent day!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Weather Report', speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        console.log(`Session ended with reason: ${(handlerInput.requestEnvelope.request as SessionEndedRequest).reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler: ErrorHandler = {
    canHandle(handlerInput: HandlerInput, error: Error): boolean {
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error): Response {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};


let skill: any;

exports.handler = async (event: any) => {
    // console.log(`REQUEST++++${JSON.stringify(event)}`);
    if (!skill) {
        skill = SkillBuilders.custom()
            .addRequestHandlers(
                LaunchRequestHandler,
                WeatherReportIntentHandler,
                HelpIntentHandler,
                CancelAndStopIntentHandler,
                SessionEndedRequestHandler,
            )
            .addErrorHandlers(ErrorHandler)
            .create();
    }

    const response = await skill.invoke(event);
    // console.log(`RESPONSE++++\n${JSON.stringify(response)}`);

    return response;
};
