class KeystrokePlayback {
    constructor(id){
        this.element = document.getElementById(id);
        this.showing_indicator = false;
    }

    play(){
        let { textContent } = this.element;
        if(this.showing_indicator) {
            this.element.textContent = textContent + " _";
        } else {
            this.element.textContent = textContent.slice(0, -2);
        }
        this.showing_indicator = !this.showing_indicator;
    }

}

export { KeystrokePlayback }