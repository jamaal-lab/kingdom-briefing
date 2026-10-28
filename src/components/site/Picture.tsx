import type { CSSProperties, ImgHTMLAttributes } from 'react'
import { srcSet, fallbackSrc, type MediaAsset } from '~/lib/media'

type Props = {
  asset: MediaAsset
  /** Optional portrait art-direction for narrow, tall viewports. */
  portrait?: MediaAsset
  sizes?: string
  alt?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
} & Pick<ImgHTMLAttributes<HTMLImageElement>, 'onLoad'>

/** AVIF → WebP responsive picture with explicit dimensions (no layout shift). */
export function Picture({ asset, portrait, sizes = '100vw', alt, priority, className, imgClassName, style, onLoad }: Props) {
  return (
    <picture className={className} style={style}>
      {portrait && <source type="image/avif" media="(max-aspect-ratio: 1/1)" srcSet={srcSet(portrait, 'avif')} sizes={sizes} />}
      {portrait && <source type="image/webp" media="(max-aspect-ratio: 1/1)" srcSet={srcSet(portrait, 'webp')} sizes={sizes} />}
      <source type="image/avif" srcSet={srcSet(asset, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(asset, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(asset)}
        width={asset.width}
        height={asset.height}
        alt={alt ?? asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={imgClassName}
        onLoad={onLoad}
      />
    </picture>
  )
}
