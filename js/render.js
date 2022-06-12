const color = {
    '1': "rgb(159, 218, 20)",
    '2': "rgb(215, 218, 20)",
    '3': "rgb(20, 129, 218)",
    '4': "rgb(43, 233, 217)",
    '5': "rgb(218, 109, 20)",
    '6': "rgb(202, 20, 218)",
    '7': "rgb(218, 20, 20)",
 };

import Tetris from './tetris.js';
export default class Render{
    constructor(elem,width,height,rows,cols){
        this.elem = elem;
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx = this.canvas.getContext('2d');
        
        this.Border_width = 5;
        this.Playfield_width = this.width * 452/640;
        this.Playfield_height = this.height;
        this.Internal_width = this.Playfield_width - this.Border_width*2;
        this.Internal_height = this.Playfield_height - this.Border_width*2;

        this.Block_width = this.Internal_width/ cols;
        this.Block_height = this.Internal_height / rows;
        
        this.Panel_width = this.width * 188/640;
        this.Panel_height = this.height;

        this.elem.appendChild(this.canvas);

    }
    
    Screen_clear=()=>{
        this.ctx.clearRect(0,0, this.width,this.height);
    }

    Main_render=(state)=>{
        this.Screen_clear();
        this.PlayField_render(state);
        this.Panel_render(state);
    }

    Start_render=()=>{
        this.ctx.fillStyle = 'white';
        this.ctx.font = "20px 'Courier New' ";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Press Enter to start', this.width/2-100, this.height/2);
    }

    Pause_render=()=>{
        this.ctx.fillStyle = 'white';
        this.ctx.font = "20px 'Courier New' ";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Pause', this.width/2-100, this.height/2-30);
        this.ctx.fillText('press Enter to contitue', this.width/2-100, this.height/2);
        this.ctx.fillText('or press Esc to restart', this.width/2-100, this.height/2+30);
    }

    GameOver_render=({score})=>{
        this.Screen_clear();
        this.ctx.fillStyle = 'white';
        this.ctx.font = "20px 'Courier New' ";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Game Over!', this.width/2, this.height/2-30);
        this.ctx.fillText('press Enter to restart', this.width/2, this.height/2+30);
        this.ctx.fillText('Score: '+score, this.width/2, this.height/2);
        
    }

    PlayField_render=({playfield})=>{
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            for (let x = 0; x < line.length; x++) {
                const blocks = line[x];
                if(blocks) {
                    this.Block_render(x*this.Block_width, y*this.Block_height, 
                        this.Block_width, this.Block_height,color[blocks]) 
                } 
            }
        }
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = this.Border_width;
        this.ctx.strokeRect(0,0,this.Internal_width,this.Internal_height);
    }

    Block_render=(x,y,width,height,color)=>{
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;

         this.ctx.fillRect(x,y,width,height);
         this.ctx.strokeRect(x,y,width,height);
    }
    
    Panel_render=({lvl,score,lines,Tetro_next,stat})=>{
        const Panel_x = this.Playfield_width + 15;
        const Panel_y = 0;
        this.ctx.textAlign ="start";
        this.ctx.textBaseline ="top";
        this.ctx.fillStyle = "white";
        this.ctx.font = "18px 'Courier New' ";
        this.ctx.fillText('Score: '+score, Panel_x, Panel_y);
        this.ctx.fillText('Lines: '+lines, Panel_x, Panel_y+23);
        this.ctx.fillText('Level: '+lvl, Panel_x, Panel_y+46);
        this.ctx.fillText('Next: ', Panel_x+25, Panel_y+500);
        this.ctx.fillText('Statistics: ', Panel_x, Panel_y+69);
        for(let i=1; i<stat.length; i++){
            this.ctx.fillText( stat [i], Panel_x, Panel_y +100+(i-1)*57);  
        }
        
        for (let x = 0; x < Tetro_next.block.length; x++) {

            for (let y = 0; y < Tetro_next.block[x].length; y++){
                const blocks = Tetro_next.block[x][y];
                if(blocks){
                    const Block_x = Panel_x + this.Block_width* x;
                    const Block_y = Panel_y + this.Block_height* y;
                    this.Block_render( Block_x, Block_y+525, this.Block_width, this.Block_height, color[blocks], //тут теж колір
                    )
                }
            }
            
        }
       let tetro = 0;
    for (let j = 0; j<7; j++){
        tetro = Tetris.tetramino[j+1];
        for (let x = 0; x < tetro.length; x++) {
            const line = tetro[x];
            for (let y = 0; y < line.length; y++) {
                let blocks = line[y];
                if(blocks){
                    let Block_x = Panel_x + this.Block_width* x*0.5;
                    let Block_y = 70 + Panel_y + this.Block_height* y*0.5;
                    this.Block_render( Block_x + 32, Block_y + j * 60, this.Block_width * 0.5, this.Block_height * 0.5, color[j+1], 
                    )}}}
    }
    }
}
