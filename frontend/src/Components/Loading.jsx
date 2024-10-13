
// import React from 'react';

// function Loading() {
//     return (
//         <div className="loading-container">
//             <lottie-player
//                 src="https://lottie.host/0279bcb5-888a-4a9c-ae83-3aea6eb3c65f/RGyXb9DasY.json"
//                 background="transparent"
//                 speed="1"
//                 style={{ width: 300, height: 300 }}
//                 loop
//                 autoplay
//             ></lottie-player>
//             <p>Submitting your request...</p>
//         </div>
//     );
// }

// export default Loading;


import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

function Loading() {
    return (
        <div className="loading-container" style={{
            marginLeft:'50px'
        }}>
            <Player
                autoplay
                loop
                src="https://lottie.host/0279bcb5-888a-4a9c-ae83-3aea6eb3c65f/RGyXb9DasY.json"
                style={{ height: '300px', width: '300px' }}
            />
            <p>Submitting your request...</p>
        </div>
    );
}

export default Loading;