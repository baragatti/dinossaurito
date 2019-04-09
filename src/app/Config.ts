const Config = {
    Debug: {
        SHOW_COLLIDERS: true,
    },
    Game: {
        OFFSET_SPEED: 0.4,
        MAX_TIME_TICK: 1000 / 60,
        SCREEN_BUFFER: 50,
        GROUND_BUFFER: 10,
        MIN_OBSTACLE_DISTANCE: 400,
        JUMP_KEY: 32,
    },
    Player: {
        STEP_SPEED: 0.02,
        JUMP_DISTANCE: 250,
        JUMP_HEIGHT: 80,
    },
    Score: {
        FACTOR: 0.1,
    },
    Assets: {
        HREF: 'assets/',
    },
};

export default Config;