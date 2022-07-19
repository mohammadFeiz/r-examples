import React,{Component,useEffect} from "react";
import "./index.css";
import Button from 'aio-button';
import Table from 'aio-table';
import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";

export default class RExamples extends Component{
  constructor(props){ 
    super(props);
    let index = localStorage.getItem('aioformtestindex');
    if(index === null){index = false;}
    else {
      index = JSON.parse(index)
    }
    this.state = {
      view:'preview',
      activeExample:index,
      examples:props.examples
    }
  }
  getExample(index){
    if(index === false){return null}
    let {examples} = this.state;
    if(index.length === 1){
      localStorage.setItem('aioformtestindex',JSON.stringify(index));
      return examples[index[0]]
    }
    let result = examples[index[0]];
    for(let i = 1; i < index.length - 1; i++){
      result = result.childs[index[i]]
    }
    try{
      result = result.childs[index[index.length - 1]];
      localStorage.setItem('aioformtestindex',JSON.stringify(index));
    }
    catch{result = null}
    return result
  }
  getComponent(example){
    if(example === null){return null}
    if(!example.component){
      localStorage.clear('aioformtestindex');
      return null
    }
    return example.component();
  }
  getProps(){
    let obj = {};
    for(let prop in this.props){
      if(prop !== 'examples' && prop !== 'headerHTML'){
        obj[prop] = this.props[prop]  
      }
    }
    return obj
  }
  render(){
    let {activeExample,examples,view} = this.state;
    let {headerHTML} = this.props;
    let example = this.getExample(activeExample);
    let ActiveComponent = this.getComponent(example)

    let Wrapper = ActiveComponent === null?null:<ActiveComponent {...this.getProps()}/>
    return (
      <div className='r-examples'>
        <div className='r-examples-header'>
          {!!headerHTML && headerHTML}
          <div style={{flex:1}}></div>
          <Button
            type='select'
            style={{height:36,background:'dodgerblue',color:'#fff',borderRadius:5}}
            options={[
              {text:'Preview',value:'preview'},
              {text:'Code',value:'code'},
              {text:'Model',value:'model'}
            ]}
            value={view}
            onChange={(value)=>this.setState({view:value})}
          />
        </div>
        <div className='r-examples-body'>
          <div className='r-examples-tree'>
            <Table
              model={examples}
              getRowChilds='row.childs'
              columns={[
                {title:'Examples',getValue:'row.title',treeMode:true,cellAttrs:(row)=>{
                  let {activeExample} = this.state;
                  let a = row._nestedIndex.toString()
                  let b = activeExample.toString();
                  let active = a === b;
                  return {
                    style:{cursor:'pointer'},
                    className: active?'active':'',
                    onClick:()=>{
                      if(row._childsLength > 0){return }
                      this.setState({activeExample:row._nestedIndex})
                    }
                  }
                }}
              ]}
            />
          </div>
          {view === 'preview' && Wrapper}
          {view === 'code' && <Code code={example.code} language='javascript'/>}  
          {view === 'model' && <Code code={typeof example.model === 'string'?example.model:JSON.stringify(example.model)} language='javascript'/>}  
        </div>
      </div>
    );
  }
}
function Code({ code, language }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div className="Code" style={{overflowY:'auto',width:'100%',height:'100%'}}>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

