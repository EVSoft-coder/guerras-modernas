class PollingService {
    private interval: any = null;

    start(callback: () => void, delay: number = 10000) {
        this.stop();
        this.interval = setInterval(() => {
            callback();
        }, delay);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

export default new PollingService();
