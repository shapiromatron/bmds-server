import {observable, action, computed} from 'mobx';

class DataStore{

    @observable datasets=[];

    @action addDataSets= (dataset)=>{
        this.datasets.push(dataset);
        
    }
    
    @computed get dataSetCount(){
        
        return this.datasets.length;
    }
}


const store = new DataStore();
export default store; 