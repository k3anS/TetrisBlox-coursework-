import Tetris from './tetris.js';
import Render from './render.js';

const screen = 640

const element = document.querySelector('#game');
const tetris = new Tetris();
const render = new Render(element, screen, screen, tetris.rows, tetris.cols);

const start_speed = 900
let in_process = false;
let interval=null;

render.Main_render(tetris.Data_update());
render.Start_render();

function Screen_update(){
    if ( tetris.Data_update().isOver) render.GameOver_render(tetris.Data_update());
    else if(!in_process)render.Pause_render(); 
    else render.Main_render( tetris.Data_update()); 
    }

function Game_reset(){   
    tetris.reset();
    Play();
}

function Pause(){
    in_process = false;
    Stop();
    Screen_update();
}

function Play(){
    in_process = true;
    Start();
    Screen_update();
}

function Stop(){
    if (interval){
    clearInterval(interval);
    interval = null;
    }
}
function Speed_set(){
    const speed = start_speed - tetris.Data_update().lvl * 100;
    if (speed>0) return speed;
    else return 100;
}

function Start(){
    if (!interval){
        interval = setInterval(() => {
            tetris.move_Down()
            Screen_update()},Speed_set());}
}

document.addEventListener('keydown',e =>{
    switch(e.key) {
        case 'Escape':
           Game_reset(); 
        case 'Enter':
            if (tetris.Data_update().isOver) { 
                render.GameOver_render(tetris.Data_update());
                Game_reset(); 
            }  
            if (in_process) Pause();
            else if (!in_process) Play();
            break;
        
        case 'ArrowLeft':
            if(in_process || tetris.Data_update().isOver){
            tetris.move_Left();
            render.Main_render(tetris.Data_update());
            break;
            }
        case 'ArrowUp':
            if(in_process || tetris.Data_update().isOver){
            tetris.Tetro_rotate();
            render.Main_render(tetris.Data_update());
            break;
            }
        case 'ArrowRight':
            if(in_process || tetris.Data_update().isOver){
            tetris.move_Right();
            render.Main_render(tetris.Data_update());
            break;
            }
        case 'ArrowDown':
            if(in_process || tetris.Data_update().isOver){
            tetris.move_Down();
            render.Main_render(tetris.Data_update());
            break;
            }
    }
});


 

