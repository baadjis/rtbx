/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Builder from '../Builder'
import FlyerEditor from './FlyerEditor'
import FlyerPreview from './FlyerPreview'
import { basicFlyerTemplate } from './templates'
import { Data } from './data'

export default function FlyerBuilder(props: any) {
  return (
    <Builder
      initialData={basicFlyerTemplate}
      data={Data}
      {...props}

      renderEditor={(ctx) => <FlyerEditor {...ctx} />}
      renderPreview={(ctx) => <FlyerPreview {...ctx} />}
    />
  )
}

