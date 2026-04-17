
import { DesignNode } from "@/lib/design/types"

export const flyerTree: DesignNode[] = [
  {
    id: "root",
    type: "container",
    props: {
      x: 0,
      y: 0,
      width: 300,
      height: 500,
      backgroundColor: "#ffffff"
    },
    children: [
      {
        id: "title",
        type: "text",
        props: {
          x: 40,
          y: 40,
          text: "BIG SALE",
          fontSize: 24,
          fontWeight: "bold",
          color: "#000"
        }
      },
      {
        id: "subtitle",
        type: "text",
        props: {
          x: 40,
          y: 80,
          text: "Up to 50% OFF",
          fontSize: 16,
          color: "#666"
        }
      }
    ]
  }
]

