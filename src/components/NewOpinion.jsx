import { useActionState, use } from 'react';

import { OpinionsContext } from '../store/opinions-context';

export function NewOpinion() {
  const { addOpinion } = use(OpinionsContext);

  async function shareOpinionAction(prevState, formData) {
    const title = formData.get('title');
    const body = formData.get('body');
    const userName = formData.get('userName');

    let errors = [];

    if(title.trim().length < 5) {
      errors.push('Title must be at least five characters long.');
    }

    if(body.trim().length <10 || body.trim().length > 300) {
      errors.push('Opinion must be between 10 and 300 characters long.');
    }

    if(!userName.trim()) {
      errors.push('Please provide your name');
    }

    if(errors.length > 0) {
      return {
        errors,
        enteredValues: {
          title,
          body,
          userName,
        },
      };
    }

    // await harus pake async di function utamanya\
    // ini bakal nunggu sampe addOpinion (fetch post) kelar, baru jalanin function bawahnya
    await addOpinion({ title, body, userName})
    return { errors: null };
  }

  // formAction itu yg dipassing ke action di form, dan param kedua dari useActionState itu nandain state awalnya apa
  // di shareOpinionAction, harus tambah 1 param lg selain formData yaitu prevState
  const [formState, formAction] = useActionState(shareOpinionAction, { errors: null });

  return (
    <div id="new-opinion">
      <h2>Share your opinion!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Your Name</label>
            <input 
              type="text" 
              id="userName" 
              name="userName" 
              defaultValue={formState.enteredValues?.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              defaultValue={formState.enteredValues?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea 
            id="body" 
            name="body" 
            rows={5}
            defaultValue={formState.enteredValues?.body}
          ></textarea>
        </p>

        {formState.errors && (
          <ul className="errors">
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <p className="actions">
          <button type="submit">Submit</button>
        </p>
      </form>
    </div>
  );
}
