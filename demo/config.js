alt.environment = 'development';
alt.urlArgs = alt.environment == 'production' ? '_v=' + alt.version : '_t=' + (+new Date());

requirejs.config({urlArgs: alt.urlArgs});