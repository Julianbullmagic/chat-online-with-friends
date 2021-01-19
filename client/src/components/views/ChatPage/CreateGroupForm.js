import React, {useRef,useState} from 'react'
import { Button } from 'antd';



export default function CreateGroupForm() {
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')

const [toggle, setToggle] = useState(false);


function handleSubmit(e) {

    const newGroup={
      title: titleValue.current.value,
      description:descriptionValue.current.value,
    }
    console.log(newGroup)
    const options={
        method: "POST",
        body: JSON.stringify(newGroup),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}

      fetch(`api/chat/addgroup`, options)
              .then(response => response.json()).then(json => console.log(json));
setToggle(!toggle)

}






  return (
    <section className='section search'>
    <h3>Create a Group</h3>
    <div className="form-style-5">
      <form className='search-form'>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='titleValue'
          id='titleValue'
          ref={titleValue}

        />
        <label htmlFor='name'>Description</label>
        <input
          type='text'
          name='descriptionValue'
          id='descriptionValue'
          ref={descriptionValue}

        />

        <Button type="primary" style={{ width: '30%' }} onClick={handleSubmit} htmlType="submit">
        Submit Group
        </Button>
        </div>
      </form>
      </div>
    </section>
  )}
