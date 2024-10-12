import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

function Loading_car() {
    return (
        <div className="loading-container">
            <Player
                autoplay
                loop
                src="https://lottie.host/a93f554b-fc9c-4955-ae04-ef1bea5940ab/wNfYcxKmA4.json"
                style={{ height: '300px', width: '300px', background: 'transparent' }}
            />
            <p style={{fontweight:'bold', fontsize: 'medium'}}>Loading........</p>
        </div>
    );
}

export default Loading_car;