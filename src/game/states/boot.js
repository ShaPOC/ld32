module.exports = {

    init: function () {
        //Add here your scaling options
    },

    preload: function () {
        //Load just the essential files for the loading screen,
        //they will be used in the Load State
        game.load.image('loading', 'resources/loading.png');
        game.load.image('load_progress_bar', 'resources/progress_bar_bg.png');
        game.load.image('load_progress_bar_dark', 'resources/progress_bar_fg.png');
    },

    create: function () {
        game.state.start('load');
    }
};