import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import DOMPurify from 'isomorphic-dompurify';
import ReactMarkdown, { Components } from "react-markdown";
import Image from "next/image";

const remarkPlugins: any[] = [remarkEmoji,remarkGfm], rehypePlugins = [rehypeRaw];
const customComponents: Partial<Components> = {
     h1: 'h2',
     u: 'ins',
     p: (paragraph:any) => {
          const {node} = paragraph;
          if(node?.children[0].tagName === 'img'){
               const image = node.children[0]
               const metastring = image.properties.alt
               const alt = metastring?.replace(/ *\{[^)]*\} */g, "")
               const metaWidth = metastring.match(/{([^}]+)x/)
               const metaHeight = metastring.match(/x([^}]+)}/)
               const width = metaWidth ? metaWidth[1] : "500"
               const height = metaHeight ? metaHeight[1] : "300"
               return <Image src={image.properties.src} width={width} height={height} className="postImg" alt={alt} priority/>
          }
          return <p>{paragraph.children}</p>
     }
}
export const MarkdownView = ({children}: any)=><ReactMarkdown components={customComponents} remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{DOMPurify.sanitize(children)}</ReactMarkdown>
export const MarkdownViewForChatBot = ({children}: any)=><ReactMarkdown components={customComponents}>{DOMPurify.sanitize(children)}</ReactMarkdown>