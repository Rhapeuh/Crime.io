export class CharStat{
    vie : number;
    
    constructor(vie: number){
        this.vie = vie;        
    }

    enVie() : boolean{
        return this.vie > 0;
    }
}