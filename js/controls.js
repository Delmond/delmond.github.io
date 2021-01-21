class CanvasControls {
    constructor(id, animation) {
        this.controls = document.getElementById(id);
        this.play = this.controls.querySelector("#play");
        this.pause = this.controls.querySelector("#pause");
        
        this.animation = animation;

        this.playPressed = false;

        if(this.playPressed){
            this.play.classList.add("selected");
        } else {
            this.pause.classList.add("selected");
        }

        this.loop = () => {
            if (this.playPressed) {
                window.requestAnimationFrame(this.loop);
            }
            this.animation();
        }
        
        this.loop();

        this.play.addEventListener("click", () => {
            if(this.playPressed)
                return;

            this.togglePlay();
            this.loop();
            
        })
        this.pause.addEventListener("click", () => {
            if(!this.playPressed)
                return;

            this.togglePlay();
        })
    }
    togglePlay(){
        this.playPressed = !this.playPressed;
        this.play.classList.toggle("selected");
        this.pause.classList.toggle("selected");
    }

}
export { CanvasControls };