import { use, useActionState, useOptimistic } from 'react';
import { OpinionsContext } from '../store/opinions-context';

export function Opinion({ opinion: { id, title, body, userName, votes } }) {
  const { upvoteOpinion, downvoteOpinion } = use(OpinionsContext);

  // setVotesOptimistically itu yang harus dipanggil untuk menjalankan param kedua di useOptimistic
  // prevVotes selalu ada sebagai param awal, sisanya ya sesuai yg kita tambahin
  const [optimisticVotes, setVotesOptimistically] = useOptimistic(
    // setVotesOptimistically itu dipanggil, jalanin function di param kedua, trs optimisticVotes valunya ada sementara
    // lalu setelah upvoteOpinion(id) atau downvoteOpinion(id) dijalnin, votes (param pertama), value aslinya bakal keupdate
    votes,
    (prevVotes, mode) => (mode === 'up' ? prevVotes + 1 : prevVotes - 1)
  );

  async function upvoteAction() {
    // function akan execute dan menghasilkan value optimisticVotes baru
    // 
    setVotesOptimistically('up');
    await upvoteOpinion(id);
  }

  async function downvoteAction() {
    setVotesOptimistically('down');
    await downvoteOpinion(id);
  }

  // gaperlu param kedua karna ya gada manage state apa apa disini
  const [upvoteFormState, upvoteFormAction, upvotePending]= useActionState(upvoteAction);
  const [downvoteFormState, downvoteFormAction, downvotePending] = useActionState(downvoteAction);

  return (
    <article>
      <header>
        <h3>{title}</h3>
        <p>Shared by {userName}</p>
      </header>
      <p>{body}</p>
      <form className="votes">
        <button formAction={upvoteFormAction} disabled={upvotePending || downvotePending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </button>

        <span>{optimisticVotes}</span>

        <button formAction={downvoteFormAction} disabled={upvotePending || downvotePending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="m8 12 4 4 4-4" />
          </svg>
        </button>
      </form>
    </article>
  );
}
