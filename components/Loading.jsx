const Loading = () => {
  return (
    // this code was taken from a codepen.io pen by Technophile
    <div className="loading-wrapper flex">
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <style jsx global>{`
        :root {
          --loading-spinner-size: 2rem; // size of each loading ball
          --loading-spinner-gap: 1;
          --loading-spinner-wrapper: calc(
            var(--loading-spinner-size) * 3 + var(--loading-spinner-gap) *
              var(--loading-spinner-size) * 2
          ); // calculate the width of the loading wrapper based on the number of balls                    
          --animation-timing: cubic-bezier(0, 1, 1, 0);
          --animation-duration: 600ms;
          --animation-count: infinite;
          --loading-spinner-color: #222;
        }
      `}</style>

      <style jsx>{`
        .loading-wrapper {
          position: fixed;
          inset: 0;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.2);
          z-index: 999;
        }
        .loading {
          --spacer: calc(
            var(--loading-spinner-size) * var(--loading-spinner-gap) +
              var(--loading-spinner-size)
          );
          position: relative;
          width: var(--loading-spinner-wrapper);
          height: var(--loading-spinner-size);
          /* border: 1px solid red; */
        }

        .loading > span {
          position: absolute;
          top: 0;
          width: var(--loading-spinner-size);
          aspect-ratio: 1;
          border-radius: 50%;
          background-color: var(--loading-spinner-color);
        }

        .loading > span:nth-child(1) {
          left: 0;
          animation: scale-up var(--animation-duration) var(--animation-timing)
            var(--animation-count);
        }

        .loading > span:nth-child(2) {
          left: 0;
          animation: move-right var(--animation-duration)
            var(--animation-timing) var(--animation-count);
        }

        .loading > span:nth-child(3) {
          left: calc(var(--spacer) * 1);
          animation: move-right var(--animation-duration)
            var(--animation-timing) var(--animation-count);
        }

        .loading > span:nth-child(4) {
          left: calc(var(--spacer) * 2);
          animation: scale-down var(--animation-duration)
            var(--animation-timing) var(--animation-count);
        }

        @keyframes scale-up {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes scale-down {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(0);
          }
        }
        @keyframes move-right {
          from {
            transform: translate(0);
          }
          to {
            transform: translate(var(--spacer));
          }
        }
      `}</style>
    </div>
  );
};
export default Loading;