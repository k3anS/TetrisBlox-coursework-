let stat = [0,0,0,0,0,0,0,0]

export default class Tetris{

    cols = 16;
    rows = 20;
    points = [100,300,700,1500];
    score = 0;
    lines = 0;
    lvl = 0;
    top_out = false; 
    playfield = this.Playfield_create();
    Tetro_active = this.Tetro_create();
    Tetro_next = this.Tetro_create();
 
    static tetramino = {
        "1":[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        "2":[[0,0,0], [2,2,2],[0,0,2]],
        "3":[[0,0,3],[3,3,3],[0,0,0]],
        "4":[[0,0,0,0],[0,4,4,0],[0,4,4,0],[0,0,0,0]],
        "5":[[0,0,0],[5,5,5],[0,5,0]],
        "6":[[0,0,0],[0,6,6],[6,6,0]],
        "7":[[0,0,0],[7,7,0],[0,7,7]]

    };
   

    get_RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
    
    reset=()=>{
        this.lines = 0;
        this.score = 0;
        this.top_out = false;
        this.playfield = this.Playfield_create();
        this.Tetro_active = this.Tetro_create();
        this.Tetro_next = this.Tetro_create();
        stat = [0,0,0,0,0,0,0,0]
    }
  
    get_lvl=()=>{
        this.lvl = Math.floor(this.lines/10);
        return this.lvl;
    }

    Data_update=()=>{
        const playfield = this.Playfield_create();

        for (let y=0; y<this.playfield.length; y++){
            playfield[y] = [];
            for (let x = 0; x < this.playfield.length; x++) {
                playfield[y][x] = this.playfield[y][x];
                
            }
        }
        for (let y = 0; y < this.Tetro_active.block.length; y++) {
            for (let x= 0; x < this.Tetro_active.block[y].length; x++) {
                if (this.Tetro_active.block[y][x]){
                    playfield[this.Tetro_active.y+y][this.Tetro_active.x+x] = this.Tetro_active.block[y][x];
                }
            }
            
        }

        return{
            score: this.score,
            lvl:  this.get_lvl(),
            lines: this.lines,
            Tetro_next: this.Tetro_next,
            stat: stat,
            playfield,
            isOver: this.top_out,
        };
    }

    Playfield_create(){
        const playfield =[]
        for (let y=0; y<this.rows; y++){
            playfield[y] = [];
            for (let x = 0; x < this.cols; x++) {
                playfield[y][x] = 0;
            }
        }
        return playfield;
    }

    Tetro_create(){
        const index = this.get_RandomInt(1,8)
        stat[index] +=1; 
        const tetro = {x: this.get_RandomInt(0,this.cols-4), y:0};
        tetro.block = Tetris.tetramino[index];
        return tetro;
}


Score_update=(cleared)=>{
    if (cleared>0){
        this.score += this.points[cleared-1] * (this.get_lvl() + 1);
        this.lines += cleared; 
    } 
}
    
    move_Left=()=>{
        this.Tetro_active.x-=1;
        if (this.collides()){
         this.Tetro_active.x+=1
        }
    }

    move_Right=()=>{
     this.Tetro_active.x+=1;
        if (this.collides()){
            this.Tetro_active.x-=1
     }
    }

    move_Down=()=>{
    if(this.top_out) return;
    this.Tetro_active.y+=1;
    if (this.collides()){
        this.Tetro_active.y-=1;
        this.froze();
        this.Score_update(this.Line_clear());
        this.Tetro_update();
    }
    if(this.collides()) this.top_out = true;    
}

    Tetro_rotate=()=>{   
        const block = this.Tetro_active.block;
        const length = block.length;
        const temp = [];
        for (let i= 0; i< length; i++) {
            temp[i] = new Array(length).fill(0);  
        }
        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                temp[x][y] = this.Tetro_active.block[length-1-y][x];  
        }
        }
        this.Tetro_active.block = temp;
        if (this.collides()){
            this.Tetro_active.block = block;
        }
    }

    collides=()=>{
         const {y: tetro_Y, x: tetro_X} = this.Tetro_active;
            for (let y = 0; y < this.Tetro_active.block.length; y++) {
             for (let x = 0; x < this.Tetro_active.block[y].length; x++){
                 if(this.Tetro_active.block[y][x] &&  
                 ((this.playfield[tetro_Y+y]==undefined || this.playfield[tetro_Y+y][tetro_X+x]==undefined) || 
                 this.playfield[tetro_Y+y][tetro_X+x])) {
                    return true;
                }
            }
        }
        return false
}
    froze=()=>{
        for (let y = 0; y < this.Tetro_active.block.length; y++) {
            for (let x = 0; x < this.Tetro_active.block[y].length; x++){
                if(this.Tetro_active.block[y][x]){
                this.playfield[this.Tetro_active.y+y][this.Tetro_active.x+x] = this.Tetro_active.block[y][x]
            }
        }
    }
}

 Line_clear=()=>{
     let lines = []
     for (let y = this.rows-1; y >=0; y--) {
         let number = 0;
         for (let x = 0; x < this.cols; x++) if(this.playfield[y][x]) number+=1;
         if (number ===0) break;
         else if (number < this.cols) continue;
         else if (number === this.cols) lines.unshift(y);
        }
        for (let index of lines){
            this.playfield.splice(index,1);
            this.playfield.unshift(new Array(this.cols).fill(0)); 
        }
        return lines.length;
 }

    Tetro_update=()=>{
        this.Tetro_active = this.Tetro_next;
        this.Tetro_next = this.Tetro_create();
    }
   
    
}