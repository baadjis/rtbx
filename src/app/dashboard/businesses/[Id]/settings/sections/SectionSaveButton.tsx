import {

  Check,

  Save

} from 'lucide-react'

type Props={

  loading:boolean

  dirty:boolean

  saved?:boolean

  label:string

  savingLabel:string

  savedLabel:string

  onClick:()=>void

}

export default function SectionSaveButton({

  loading,

  dirty,

  saved=false,

  label,

  savingLabel,

  savedLabel,

  onClick

}:Props){

  return(

    <div className="
      
      pt-8
    ">

      <button

        disabled={

          loading ||

          !dirty

        }

        onClick={onClick}

        className="
        

          px-6
          py-4

          rounded-2xl

          bg-indigo-600

          disabled:bg-slate-300

          text-white

          font-black

          flex
          items-center
          justify-center
          gap-2
        "

      >

        {

          loading

          ?(

            savingLabel

          )

          :saved

          ?<>

            <Check size={18}/>

            {savedLabel}

          </>

          :<>

            <Save size={18}/>

            {label}

          </>

        }

      </button>

    </div>

  )

}