import React from 'react'
import {ChildKeys,Clothes} from '../../types'
import ShowClothes from '../clothes/ShowClothes'
import EditClothes from '../clothes/EditClothes'
import APIURL from '../../helpers/environment'
interface EditChildProps{
    child:ChildKeys;
    sessionToken:string

}

interface EditChildState{
    openEditClothes:boolean;
    activeClothes:Clothes|null
    clothes:Clothes[]

}

export default class EditChild extends React.Component<EditChildProps,EditChildState>{
    constructor(props:EditChildProps){
        super(props)
        this.state={
            openEditClothes:false,
            clothes:[],
            activeClothes:null
        }
    }
    getAllClothes=async()=>{
        const result = await fetch(`${APIURL}/clothing/all/${this.props.child.id}`,{
          method:"GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: this.props.sessionToken,
          })
        })
        const clothes=await result.json();
        console.log(clothes)
        this.setState({clothes:clothes})
      }
      setActiveClothes=(clothes:Clothes)=>{
          this.setState({activeClothes:clothes})
          console.log(clothes)
      }
      setOpenClothes=(TorF:boolean)=>{
          this.setState({openEditClothes:TorF})
      }
      componentDidMount(){
          this.getAllClothes()
      }
    render(){
        return(
            <div>
                <p>Edit {this.props.child.name}</p>
                <ShowClothes setActiveClothes={this.setActiveClothes} setOpenClothes={this.setOpenClothes} clothes={this.state.clothes} sessionToken={this.props.sessionToken} delete={true} child={this.props.child} getAllClothes={this.getAllClothes}/>
                    
                <EditClothes clothes={this.state.activeClothes} setOpenClothes={this.setOpenClothes} getAllClothes={this.getAllClothes} child={this.props.child} sessionToken={this.props.sessionToken}  open={this.state.openEditClothes}/>

            </div>
        )
    }
}