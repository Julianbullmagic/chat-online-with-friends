import React, {useRef,useState} from 'react'



export default function CreateGroupForm() {
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')

const [toggle, setToggle] = useState(false);


function handleSubmit(e) {

e.preventDefault()

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
    <h1>Create a Group</h1>
    <div class="form-style-5">
      <form className='search-form' onSubmit={handleSubmit}>
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


          <input type="submit" value="Submit" />
        </div>
      </form>
      </div>
    </section>
  )}
