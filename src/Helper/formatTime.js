export const formatTime = (num = 0) => {
    const minutes = Math.floor(num / 60);
    const sec = Math.round(num - minutes * 60);
    return minutes + ':' + (sec.toString().length === 1 ? '0' + sec : sec);
};