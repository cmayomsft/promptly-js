export interface Alarm {
    title: string;
    time: string;
}

declare global {
    export interface UserState {
        /** Users list of active alarms. */
        alarms?: Alarm[];
    }
}