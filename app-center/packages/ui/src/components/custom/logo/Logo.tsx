import { cn } from "@ui/lib/utils";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <div className={cn(`w-full max-h-10`)}>
      <svg
        className={cn(
          onClick ? `hover:cursor-pointer` : ``,
          `max-w-full max-h-10 w-auto h-auto fill-secondary-foreground block`,
        )}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 890 215"
        onClick={onClick}
      >
        <path
          fill="transparent"
          d="M589 216H1V1h890v215H589M834 67.9c0 27.4.1 54.7 0 82.7.4.1.7.3 1 1.4 3.8.3 7.7.5 11.5 1 4.4.6 5.7-1 5.6-5.5a3547 3547 0 0 1 0-56.5c0-7 2.3-9.8 9.4-11l8.5-1.6c0-3.3-.2-6.8 0-10.2.3-3.5-1.4-5-4.3-4.1-4.8 1.5-9.3 3.6-13 5-.9-1.3-2-4.5-3.7-4.9-4-.8-8.3-.2-12.5 0-.5 0-1 1-2 1.9-.2.3-.2.6-.5 1.8M716 80.4c-.4-.1-.7-.3-1-1.4 0-8-3.6-12-11.2-14a27 27 0 0 0-21.5 2.8c-1.2-3.2-5.8-3.8-17.1-2.3v87.1H682V86.3c0-6.2 1.2-7.3 7.5-7.3h3.5c4-.6 5.1 1 5 5v55.5c0 14.1 0 14 14 13.6 3.1-.1 4-1.2 4-4.2V80.4m53.4-.3-.4 1.8v55.7c.4.1.7.3 1 1.3 0 6.5 3.3 12 9.6 12.9 8 1.2 16.1 1.1 24.2 1 3.2 0 6.7-.8 9.7-2.1 6.2-2.7 10.4-14.4 7.3-22.4-2-5.1-7.8-1.2-11.6-2.3h-1c-3.4-.4-4.2 1.3-4.3 4.4-.2 2.5 2.2 6.4-2.3 7.5a24 24 0 0 1-8.7 1c-7-1.2-6.9-1.4-6.9-9 0-3.7.2-7.6 0-11.4-.3-3.5 1.1-4.6 4.6-4.6 9 .2 18 0 27 .1 3 0 4.5-.6 4.4-4-.2-9.7.3-19.4-.1-29-.5-8.2-4-16.8-16.5-16-6.9.3-13.7 0-20.5 0-10.1 0-14.8 4.7-15.5 15M518.5 27h364.2V7.3H293.3V27h225.2m-80 163H293.3v19.7h589.4V190H438.5M352 48.4c-.3-1-1-2.2-.9-3.2.7-5.3-2.6-5.4-6.4-5.2-5 .1-10 .2-15 0-3.5-.2-4.3 1.4-4.8 4.5-1 7-2.4 14-3.7 21L317 87.8l-4.6 28.3c-2 11.1-4.3 22.2-6.2 33.3-.2 1 2 3.3 3.2 3.4 3.6.5 7.4.5 11 0 1.3-.1 3.2-2 3.5-3.3 1.3-6.5 2-13 3.2-19.6.2-1.1 1.7-2.7 2.6-2.8 6.7-.2 13.5 0 19.7 0 1.6 8.3 3 15.9 4.7 23.5.2 1 2 2.2 3 2.3 4 .3 8 .2 12 0 .7 0 2-1.9 1.9-2.7-.5-4.4-1.3-8.7-2-13l-4.5-25.3-6.5-33.2c-2-9.8-4-19.6-6-30.3m29 60.1V177c5.2 0 9.8.2 14.4-.2 1.3 0 3.4-2 3.4-3.3.3-8.1.2-16.3.2-24.2 2 1.2 4.1 3.2 6.4 3.5 4.6.6 9.4.5 14 .1 6.2-.6 12.6-7.1 12.6-12.7 0-20.7.3-41.3-.3-62 0-3.8-2.7-9.2-5.8-10.9-8.5-4.6-17.8-5.4-26.6.3-1.7-4.6-5.4-3.8-9-3.3-1.8.3-3.7 1-5.3.6-3.4-.8-4.1.4-4 3.6v40M491.3 150c4.2-3.5 5.6-8.4 5.6-13.4.2-18.8.3-37.6 0-56.5a18 18 0 0 0-4-10.4c-6.2-7.3-19.8-7.8-28.5-2.1-5.8-5-12.3-1.4-18.1-2.7v111.8h16.4c1.1-9-1-18 1.1-26.3 9.7 3.5 18.2 4.5 27.5-.4M600 121.5V139c0 6.2 3.5 12.1 9.7 12.8 9.7 1 19.6.7 29.4.5 5.3 0 8.9-3.3 10.6-8 1.1-2.7 1.2-6 1.2-9 0-10.7 1.4-9.2-9.2-9.3-7.4 0-7.5 0-7.6 7.8 0 2.8-.7 4.4-4 4.2-4.2-.2-8.5 0-14.1 0 0-6.7.2-13.1 0-19.5-.2-3.4 1-4.6 4.5-4.6 9 .2 18 0 27 .2 3.5 0 4.6-1.2 4.6-4.6-.2-10 .3-20-.2-30-.5-8.3-4.3-13.2-11.9-14.3a110 110 0 0 0-25-1c-8.2.7-15.6 4-15.1 16.4.5 13.2.1 26.6.1 40.9M555.9 79c2.6 0 5.3.2 8 0 4.6-.6 6.8.9 6.2 6-.4 2.5-.1 5.1-.1 7.7h17c0-5.2.3-10.2 0-15.1a13 13 0 0 0-13.4-12.7c-8.2.3-16.3 0-24.5.1a15 15 0 0 0-4.7.9c-7.7 2.7-8.8 9.3-9 16.1a2014 2014 0 0 0 .1 53c.1 9.4 2.4 16 12.4 17.6a104 104 0 0 0 27.3 0c5.2-.5 10.2-3.8 10.9-10.2.6-6 .9-12 1.3-18.2h-17.7c0 4.3 1.6 10-.5 12-2.2 2.4-7.9 1.3-12 1.8-3.4.4-4.3-1.2-4.3-4.4.2-16.8 0-33.6.2-50.5 0-1.3 1.2-2.7 2.8-4.1M72 21.5V10H49c-3-.1-4 1-4 4v77c0 3 1 4.1 4 4 6-.1 12-.2 18 0 4 .3 5.1-1 5-5V21.5m92 105V182h23.4c3 0 3.6-1.4 3.6-4v-77c0-3-.9-4.1-4-4h-19c-3-.1-4.1 1-4 4v25.5M87.5 95c3.3 0 6.7-.2 10 0 3.3.3 4.5-1.3 4.5-4.2l-.1-77.4c0-1.1-1.6-3.2-2.5-3.2-8-.3-16.2-.2-24.4-.2v73.5C75 95 75 95 87.5 95m44.5 25.5V101c.1-3-1-4.1-4-4h-19c-3-.1-4 1-4 4v77c0 3 1 4.1 4 4 6-.1 12-.2 18 0 4 .3 5.1-1.1 5-5v-56.5m2 27c0 10.2-.1 20.3.1 30.5 0 1.3 1.8 3.8 2.9 3.8 8 .3 15.8.2 24 .2v-81.4c0-2.9-1.2-3.7-4-3.6-5.6 0-11.2.3-16.9-.1-4.9-.4-6.2 1.6-6.2 6.2.2 14.4.1 29 .1 44.4M16 91.2c-.3 2.7 1 3.9 3.7 3.8h19.5c2.8 0 3.8-1 3.8-3.8V13.8c0-2.8-1-3.9-3.8-3.8-6 0-12 .3-18 0-4.2-.4-5.2 1-5.2 5.2.2 25 .1 50 .1 75.9M733 143.3c1.7 4.5 4.5 8.1 9.6 8.7 6 .6 12.2.8 18.2 1.2v-15.1l-6.3-.5c-4.3-.4-6-2.5-5.5-7 .5-5.2.1-10.4.1-15.6V79h11.7c.5-16.5 2.3-14.8-10.7-15-.3 0-.5-.3-1.2-.8V50H735c-3.1-.2-4.2 1.1-4 4 .2 3.3 0 6.6 0 9.5-3.3 1.4-8-1.8-8.1 4.6 0 10.5-.3 10.5 8.1 11.3v53.8c.1 3.2.9 6.4 1.9 10.2M102 132.7c-.1-2.7.9-5.8-3.8-5.8-25.9.2-51.7.1-77.5 0-2.8 0-3.8 1.2-3.7 4v18.4c0 2.9 1.1 3.7 3.9 3.7h77.4c2.8 0 3.8-1.1 3.7-3.8v-16.5M60.5 99h-39c-3.4-.1-4.7 1-4.6 4.5.3 5.8.2 11.7 0 17.5 0 3 1.1 4 4.1 4h77c3 0 4.1-1 4-4a257 257 0 0 1 0-17.5c.2-3.5-1-4.6-4.5-4.6-12 .2-24 .1-37 .1m41.5 80v-20c.1-2.9-.9-4-4-4H21c-3.4 0-4.1 1.4-4 4.5.1 5.5.2 11 0 16.4-.3 4 1 5.2 5 5.2 25-.2 50 0 75-.1 1.5 0 3-.7 5-2m6.7-167c-1.7.2-3.8-.9-3.7 2.4v23.4h83.8V12h-80.1m47.8 28h-51.2v25.7H189c0-7.2-.2-14.2 0-21.2.2-3.4-1-4.6-4.5-4.6-9 .2-18 .1-28 .1M189 78.6c0-2.4.4-4.8-.2-7-.3-1.4-2.1-3.4-3.3-3.4-25.6-.2-51.3-.2-77 0-1.1 0-3.3 1.8-3.3 2.8-.3 7.6-.2 15.2-.2 23h84V78.6z"
        />
        <path
          fill={"currentColor"}
          d="M518 27H293.3V7.3h589.4V27H518zm-79 163h443.7v19.7H293.3V190H439zM352 48.9l6 29.8 6.5 33.2c1.6 8.4 3 16.9 4.5 25.3.7 4.3 1.5 8.6 2 13 0 .8-1.2 2.6-2 2.7-3.9.2-8 .3-11.9 0-1 0-2.8-1.4-3-2.3-1.7-7.6-3.1-15.2-4.7-23.6-6.2 0-13-.1-19.7.1-1 0-2.4 1.7-2.6 2.8-1.2 6.5-2 13.1-3.2 19.6-.3 1.4-2.2 3.2-3.5 3.3a43 43 0 0 1-11 0c-1.2-.1-3.4-2.4-3.2-3.4 1.9-11.1 4.2-22.2 6.2-33.3 1.7-9.4 3-18.9 4.6-28.3l4.2-22.3c1.3-7 2.7-14 3.7-21 .5-3.1 1.3-4.7 4.8-4.6 5 .3 10 .2 15 0 3.8 0 7.1 0 6.4 5.3-.1 1 .6 2.2.9 3.7M333 95l-3.7 17.9c5.4 0 9.6-.2 13.7 0 3.6.2 4.4-1.6 4-4.5-.5-2.7-1.3-5.4-1.8-8L340 69.8l-1.7-8a21.6 21.6 0 0 0-1.9 7.2L333 95zm48 13V68.5c-.1-3.2.6-4.4 4-3.6 1.6.4 3.5-.3 5.3-.6 3.6-.5 7.3-1.3 9 3.3 8.8-5.7 18.1-5 26.6-.3 3 1.7 5.7 7.1 5.8 11 .6 20.6.4 41.2.3 61.9 0 5.6-6.4 12.1-12.6 12.7a65 65 0 0 1-14 0c-2.3-.4-4.4-2.4-6.4-3.6 0 8 .1 16-.2 24.2 0 1.2-2.1 3.2-3.4 3.3-4.6.4-9.2.2-14.4.2v-69m34 24c0-15.1.1-30.2-.1-45.4 0-2.5-1.2-6.7-2.6-7.1-3.5-1-7.5-.3-11.3.1-.8.1-1.9 2-1.9 3.2a4269 4269 0 0 0 0 51.4c0 1.2.7 3.3 1.3 3.3 3.8.4 7.7.8 11.4.2 1.2-.2 2.1-3 3.2-5.6zm75.9 18c-8.9 4.9-17.4 3.9-27 .4-2.1 8.3 0 17.3-1.2 26.3h-16.4V65c5.8 1.3 12.3-2.3 18.1 2.7 8.7-5.7 22.3-5.2 28.5 2a18 18 0 0 1 4 10.5c.3 18.9.2 37.7 0 56.5 0 5-1.4 10-6 13.4m-27.6-67.8V138c4.8 0 8.4-.2 12 0 3 .2 3.8-1.2 3.7-3.9V82.6c0-1-.4-2.4-1-3-2-1.8-11.9-.3-14.7 2.6zM769.2 137c-.1-18.4-.2-36.7 0-55.7l.8-1.4c0-10.2 4.8-14.9 14.9-14.9 6.8 0 13.6.3 20.5 0 12.5-.8 16 7.8 16.5 16 .4 9.6 0 19.3.1 29 .1 3.4-1.4 4-4.5 4h-27c-3.4-.1-4.8 1-4.6 4.5.3 3.8.1 7.7.1 11.5 0 7.5 0 7.7 6.9 8.8 2.8.5 5.8-.2 8.7-.9 4.5-1 2.1-5 2.3-7.5.1-3.1 1-4.8 4.3-4.4h1c3.8 1.1 9.5-2.8 11.6 2.3 3.1 8-1 19.7-7.3 22.4-3 1.3-6.5 2.2-9.7 2.2-8.1 0-16.3.1-24.2-1.1-6.3-1-9.6-6.4-9.7-13.5-.2-1-.5-1.1-.7-1.3M804 92.5V78.4c-5 .2-9.7.1-14.4.7-1.3.2-3.4 2.2-3.4 3.5-.4 6-.2 12.2-.2 18h18v-8.1zM600 121c0-13.8.4-27.2-.1-40.4-.5-12.4 6.9-15.7 15-16.4a110 110 0 0 1 25.1 1c7.6 1 11.4 6 11.9 14.3.5 10 0 20 .2 30 0 3.4-1 4.6-4.6 4.6-9-.2-18 0-27-.2-3.5 0-4.7 1.2-4.6 4.6.3 6.4.1 12.8.1 19.5 5.6 0 10-.2 14.2 0 3.2.2 3.8-1.4 3.9-4.2 0-7.8.2-7.8 7.6-7.8 10.6 0 9.3-1.4 9.2 9.3 0 3 0 6.3-1.2 9-1.7 4.7-5.3 8-10.6 8-9.8.2-19.7.5-29.4-.5-6.2-.7-9.7-6.6-9.7-12.8v-18m22-43c-2.5 1-5.4 1.5-5.5 5-.2 5.3-.5 10.6-.3 15.8 0 .8 2 2 3.2 2.1 4 .3 8 0 12 .1 2.7.1 3.8-1 3.6-3.8l-.7-17.6c-2.5-.7-4.2-1.3-6-1.5-1.7-.3-3.6-.1-6.3 0zm93.8 3 .3 68c0 2.9-1 4-4 4-14 .5-14 .6-14-13.5 0-18.5-.2-37 0-55.5 0-4-1.1-5.6-5.1-5h-3.5c-6.3 0-7.5 1.1-7.5 7.3v66.3h-16.8V65.5c11.3-1.5 15.9-.9 17 2.3 6.8-4 14-4.9 21.6-2.9 7.6 2 11.2 6.2 11.3 14.8.2 1 .5 1.1.7 1.3zm-160.4-2c-1.1 1.4-2.3 2.8-2.3 4.1-.1 16.9 0 33.7-.2 50.5 0 3.2.9 4.8 4.3 4.4 4.1-.5 9.8.6 12-1.7 2-2 .5-7.8.5-12h17.7c-.4 6.1-.7 12.1-1.3 18.1-.7 6.4-5.7 9.7-10.9 10.2-9 1-18.4 1.4-27.3 0-10-1.5-12.3-8.2-12.4-17.6a2014 2014 0 0 1 0-53c0-6.8 1.2-13.4 9-16.1a15 15 0 0 1 4.6-.9c8.2 0 16.3.2 24.5 0 6.7-.3 12.8 4.5 13.3 12.6.4 5 .1 9.9.1 15.1h-17c0-2.6-.3-5.2 0-7.8.7-5-1.5-6.5-6.1-6-2.7.3-5.4.1-8.5.1zM72 22v68c.1 4-1 5.3-5 5-6-.2-12-.1-18 0-3 .1-4-1-4-4V14c0-3 1-4.1 4-4h23v12zm92 104v-25c-.1-3 1-4.1 4-4h19c3.1-.1 4 1 4 4v77c0 2.6-.6 4-3.6 4H164v-56zM87 95c-12 0-12 0-12-11.5V10c8.2 0 16.3-.1 24.4.2.9 0 2.5 2.1 2.5 3.2v77.4c0 2.9-1.1 4.5-4.4 4.3-3.3-.3-6.7-.1-10.5-.1zm45 26v56c.1 3.9-1 5.3-5 5-6-.2-12-.1-18 0-3 .1-4-1-4-4v-77c0-3 1-4.1 4-4h19c3-.1 4.1 1 4 4v20zm2 26v-44c-.1-4.5 1.2-6.5 6.1-6.1 5.7.4 11.3.2 17 0 2.7 0 4 .8 4 3.7L161 182c-8.2 0-16 .1-24-.2-1 0-2.8-2.5-2.9-3.8-.2-10.2-.1-20.3-.1-31zM16 90.7V15.3c-.1-4.2 1-5.6 5.3-5.4 6 .4 12 .2 18 0 2.7.1 3.7 1.1 3.7 4v77.4c0 2.8-1 3.9-3.8 3.8H19.7c-2.8 0-4-1-3.7-4.3zM732.6 143c-.7-3.4-1.5-6.6-1.5-9.8-.2-16.4 0-32.7 0-49v-4.8c-8.5-.8-8.3-.8-8.2-11.3 0-6.4 4.8-3.2 8.1-4.6 0-2.9.2-6.2 0-9.4-.2-3 .9-4.3 4-4.1h13.8v13.1c.7.5 1 .8 1.2.8 13 .2 11.2-1.5 10.7 15H749v36.2c0 5.2.4 10.4-.1 15.5-.5 4.6 1.2 6.7 5.5 7.1l6.3.5v15.1c-6-.4-12.1-.6-18.2-1.2-5.1-.6-8-4.2-9.9-9zM102 133.2v16c.1 2.7-.9 3.8-3.7 3.8H20.9c-2.8 0-4-.8-4-3.7.2-6.2.2-12.3 0-18.5 0-2.7 1-3.8 3.8-3.8h77.5c4.7 0 3.7 3 3.8 6.2zM61 99c12.5 0 24.5.1 36.5 0 3.4-.1 4.7 1 4.6 4.5a257 257 0 0 0 0 17.5c0 3-1.1 4-4.1 4H21c-3 0-4.1-1-4-4 .1-5.8.2-11.7 0-17.5-.2-3.5 1-4.6 4.5-4.6 13 .2 26 .1 39.5.1zm40.8 80.5c-1.8.8-3.3 1.4-4.9 1.5H22c-4 .1-5.3-1.1-5-5 .2-5.5.1-11 0-16.5-.1-3.1.6-4.6 4-4.6h77c3.1 0 4.1 1.2 4 4.2-.1 6.6 0 13.3-.2 20.4zM109.1 12h79.7v25.8H105V14.4c-.1-3.3 2-2.2 4.1-2.4zM157 40h27.5c3.5-.1 4.7 1 4.6 4.5-.3 7-.1 14-.1 21.2h-83.7V40H157zm32 39v15h-84c0-7.8-.1-15.4.2-23 0-1 2.2-2.9 3.4-2.9h76.9c1.2 0 3 2.1 3.3 3.5.6 2.2.2 4.6.2 7.4zm645.2 71c-.1-27.4-.2-54.7 0-82.7l.8-1.4c.5-.6 1-1.8 1.5-1.8 4.2-.1 8.5-.7 12.5.1 1.7.4 2.8 3.6 3.8 5 3.6-1.5 8.1-3.6 12.9-5.1 3-1 4.6.6 4.4 4-.3 3.5 0 7 0 10.3l-8.6 1.6c-7 1.2-9.5 4-9.5 11 0 18.8-.1 37.7.1 56.5 0 4.4-1.2 6.1-5.6 5.5-3.8-.5-7.7-.7-11.6-1.7-.2-1-.5-1.1-.7-1.3z"
        />
        <path
          fill={"currentColor"}
          d="M769.7 80c.2.2 0 .5-.4.8 0-.1 0-.4.4-.8zm-53.8.7c-.3.1-.6 0-.8-.6.2 0 .5.2.8.6zM834.7 66c.2.2 0 .5-.4.8 0-.1 0-.4.4-.8zm-65.6 71.3c.3-.1.6 0 .8.6-.2 0-.5-.2-.8-.6zm65 13c.3-.1.6 0 .8.6-.2 0-.5-.2-.8-.6z"
        />
        <path
          fill="transparent"
          d="M333 94.6a3683 3683 0 0 1 3.4-25.5c.3-2.3.7-4.7 2-7.2l1.6 8 5.2 30.5c.5 2.7 1.3 5.4 1.8 8 .4 3-.4 4.8-4 4.7-4.1-.3-8.3-.1-13.7-.1l3.7-18.4zm82 37.9c-1 2.1-2 5-3.2 5.2-3.7.6-7.6.2-11.4-.2-.6 0-1.3-2.1-1.4-3.3l.1-51.4c0-1.1 1.1-3 2-3.2 3.7-.4 7.7-1 11.2-.1 1.4.4 2.5 4.6 2.6 7.1.2 15.2.1 30.3 0 46zm48.6-50.6c2.5-2.6 12.4-4.1 14.3-2.4.7.7 1 2 1 3.1l.1 51.5c0 2.7-.7 4-3.7 4-3.6-.3-7.2-.1-12-.1 0-18.8 0-37.3.3-56.1zM804 93v7.7h-18c0-6-.2-12 .2-18.1 0-1.3 2-3.3 3.4-3.5 4.7-.6 9.4-.5 14.4-.7V93zM622.4 78c2.3 0 4.2-.2 6 0 1.7.3 3.4.9 5.9 1.6l.7 17.6c.2 2.7-.9 4-3.7 3.8-4-.1-8 .2-12-.1-1 0-3.1-1.3-3.1-2-.2-5.3 0-10.6.3-15.9.1-3.5 3-4 6-5z"
        />
      </svg>
    </div>
  );
}
