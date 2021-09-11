import rxjs, { fromEvent, Observable } from "rxjs";
import { debounceTime, mergeMap, filter, map, distinctUntilChanged } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

// function fromEvent( el: HTMLElement, eventType: string) {
//     return new Observable(observer => {
//         const fn = (event: KeyboardEvent) => observer.next(event);
//         el.addEventListener(eventType, fn);
//         return () => el.removeEventListener(eventType, fn);
//     })
// }

const METEO = "https://api.openweathermap.org/data/2.5/weather";
const TOKEN = "4816db2bc1d7d5621ccadd87644bd0a6";

const sub = fromEvent(document.getElementById("myInput"), "input")
    .pipe(
        map((ev) => ev.target.value),
        filter((text) => text.length > 3),
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap((text) => {
            ajax.get(`${METEO}?q=${text}&units=metric&APPID=${TOKEN}`)
                .subscribe((res) => {
                    console.log("res", res.response);
                })
        }),
        map((res) => res.response.main.temp)
    )
    .subscribe((temp) => {
        console.log("temp", temp);
    });

setTimeout(() => {
    sub.unsubscribe();
}, 3000)
