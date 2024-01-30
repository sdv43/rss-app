export const Loader = () => {
  return (
    <svg
      className={'loader'}
      xmlns="http://www.w3.org/2000/svg"
      width="96px"
      height="96px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="translate(0 -9)">
        <circle
          className={'loader_circle-1'}
          cx="50"
          cy="39.2"
          r="10"
          fill="#7179fe"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1.639344262295082s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          ></animateTransform>
          <animate
            attributeName="r"
            dur="1.639344262295082s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="0;18;0"
            keySplines="0.2 0 0.8 1;0.2 0 0.8 1"
          ></animate>
        </circle>
        <circle
          className={'loader_circle-2'}
          cx="50"
          cy="39.2"
          r="10"
          fill="#46dff0"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1.639344262295082s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="180 50 50;540 50 50"
          ></animateTransform>
          <animate
            attributeName="r"
            dur="1.639344262295082s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            values="18;0;18"
            keySplines="0.2 0 0.8 1;0.2 0 0.8 1"
          ></animate>
        </circle>
      </g>
    </svg>
  )
}
