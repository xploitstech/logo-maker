import { SVG, Svg } from "@svgdotjs/svg.js"
import { TLogo, TLogoContainer, TSlogan, TTitle } from "~/stores/LogoModel"
import { settings } from "./settings"
import { Elements } from "./utility"

const autoScallingOffsetMargin = 100

export type ContainerData = {
    containerPos: {
        x: number
        y: number
        cx: number
        cy: number
        width: number
        height: number
    }
    containerElems: Elements
}

export type LogoProps = {
    container: TLogoContainer
    logo: TLogo
    title: TTitle
    slogan: TSlogan
}

export const alignLogoTop = (props: LogoProps, draw: Svg) : ContainerData => {
    const { logo, title, slogan } = props
    
    /*
          Add the logo's SVG
    */

    const logoSVG = SVG().addTo(draw).svg(logo.src.svg)
    const svgRawDim = logoSVG.bbox() // get the natural dimension to calculate the viewbox
    logoSVG.viewbox(0, 0, svgRawDim.width, svgRawDim.height).size(logo.width, logo.height).css('fill', logo.style.fill)
    const logoDim = {
        height: settings.logo.margins.top + logo.height + settings.logo.margins.bottom, 
        width: settings.logo.margins.left + logo.width + settings.logo.margins.bottom 
    }

    /*
           Add the title's SVG
       */
    const titleSVG = draw
        .plain(title.text)
        .font({ fill: title.style.color, family: title.style.fontFamily, size: title.style.fontSize + "px" })
        .move(0, 0)
    // console.log(titleSVG.bbox(), titleSVG.rbox())
    titleSVG.leading(0)
    const titleDim = {
        height: settings.title.margins.top + title.style.fontSize + settings.title.margins.bottom, 
        width: settings.title.margins.left + titleSVG.rbox(draw).width + settings.title.margins.bottom 
    }

    /*
           Add the slogan's SVG
       */
    const sloganSVG = draw
        .plain(slogan.text)
        .font({ fill: slogan.style.color, family: slogan.style.fontFamily, size: slogan.style.fontSize + "px"})
        .move(0, 0)
    sloganSVG.leading(0)
    const sloganDim = {
        height: settings.slogan.margins.top + slogan.style.fontSize + settings.slogan.margins.bottom, 
        width: settings.slogan.margins.left + sloganSVG.rbox(draw).width + settings.slogan.margins.bottom 
    }

    /*
           Align the elements
       */

    // the elements are vertically stacked,
    // so the width of the container is equal with the width of the largest element
    // and the height is the sum of all the element's height
    const widthContainer = Math.max(logoDim.width, titleDim.width, sloganDim.width)
    const heightContainer = logoDim.height + titleDim.height + sloganDim.height // logo.height + titleDim.height + sloganDim.height
    const cx = widthContainer / 2
    const cy = heightContainer / 2

    logoSVG.move(cx - logoDim.width / 2, 0)
    titleSVG.move(cx - titleDim.width / 2, logoDim.height + settings.logo.margins.bottom + settings.title.margins.top)
    sloganSVG.move(cx - sloganDim.width / 2, logoDim.height + titleDim.height + settings.slogan.margins.top + (titleSVG.rbox(draw).height - titleDim.height) * 0.3)

    const currentViewBox = draw.viewbox()
    
    // AUTOSCAllING
    // check if the current element occupy more than the initial size of the viewbox 
    draw.viewbox(0, 0, currentViewBox.width < widthContainer ? widthContainer + autoScallingOffsetMargin : currentViewBox.width, currentViewBox.height < heightContainer ? heightContainer + autoScallingOffsetMargin : currentViewBox.height)


    return {
        containerPos: {
            x: 0,
            y: 0,
            cx,
            cy,
            width: widthContainer,
            height: heightContainer,
        },
        containerElems: {
            logoSVG,
            titleSVG,
            sloganSVG,
        },
    }
}

export const alignLogoLeft = (props: LogoProps, draw: Svg) : ContainerData => {
    const { logo, title, slogan } = props
    
     /*
          Add the logo's SVG
    */

   const logoSVG = SVG().addTo(draw).svg(logo.src.svg)
   const svgRawDim = logoSVG.bbox() // get the natural dimension to calculate the viewbox

   logoSVG.viewbox(0, 0, svgRawDim.width, svgRawDim.height).size(logo.width, logo.height).css('fill', logo.style.fill)
   const logoDim = {
    height: settings.logo.margins.top + logo.height + settings.logo.margins.bottom, 
    width: settings.logo.margins.left + logo.width + settings.logo.margins.bottom 
}

   /*
          Add the title's SVG
      */
   const titleSVG = draw
       .text(title.text)
       .font({ fill: title.style.color, family: title.style.fontFamily, size: title.style.fontSize })
       .move(0, 0)
    titleSVG.leading(0)
    const titleDim = {
        height: settings.title.margins.top + title.style.fontSize + settings.title.margins.bottom, 
        width: settings.title.margins.left + titleSVG.rbox(draw).width + settings.title.margins.bottom 
    }

   /*
          Add the slogan's SVG
      */
   const sloganSVG = draw
       .text(slogan.text)
       .font({ fill: slogan.style.color, family: slogan.style.fontFamily, size: slogan.style.fontSize })
       .move(0, 0)
    sloganSVG.leading(0)
    const sloganDim = {
        height: settings.slogan.margins.top + slogan.style.fontSize + settings.slogan.margins.bottom, 
        width: settings.slogan.margins.left + sloganSVG.rbox(draw).width + settings.slogan.margins.bottom 
    }

    // the elements are vertically stacked,
    // so the width of the container is equal with the width of the largest element
    // and the height is the sum of all the element's height
    const widthContainer = logo.width + Math.max( titleDim.width, sloganDim.width)
    const heightContainer = Math.max(logo.height, titleDim.height + sloganDim.height)
    const cx = widthContainer / 2
    const cy = heightContainer / 2

    const textContainerWidth = Math.max(titleDim.width, sloganDim.width)
    const textContainerHeight = titleDim.height + sloganDim.height
    const ctx = textContainerWidth / 2
    const cty = textContainerHeight / 2

    logoSVG.move(0, cy - logoDim.height / 2)
    titleSVG.move(logoDim.width + ctx - titleDim.width / 2, cy - (cty - titleDim.height / 2) - titleDim.height / 2)
    sloganSVG.move(logoDim.width + ctx - sloganDim.width / 2, cy + (cty - sloganDim.height / 2) - sloganDim.height / 2 + (titleSVG.rbox(draw).height - titleDim.height) * 0.3 )

    const currentViewBox = draw.viewbox()
    
    // AUTOSCAllING
    // check if the current element occupy more than the initial size of the viewbox 
    draw.viewbox(0, 0, currentViewBox.width < widthContainer ? widthContainer + autoScallingOffsetMargin : currentViewBox.width, currentViewBox.height < heightContainer ? heightContainer + autoScallingOffsetMargin : currentViewBox.height)

    return {
        containerPos: {
            x: 0,
            y: 0,
            cx,
            cy,
            width: widthContainer,
            height: heightContainer,
        },
        containerElems: {
            logoSVG,
            titleSVG,
            sloganSVG,
        },
    }
}

export const alignLogoRight = (props: LogoProps, draw: Svg) : ContainerData => {
    const { logo, title, slogan } = props
    
     /*
          Add the logo's SVG
    */

   const logoSVG = SVG().addTo(draw).svg(logo.src.svg)
   const svgRawDim = logoSVG.bbox() // get the natural dimension to calculate the viewbox

   logoSVG.viewbox(0, 0, svgRawDim.width, svgRawDim.height).size(logo.width, logo.height).css('fill', logo.style.fill)
   const logoDim = {
    height: settings.logo.margins.top + logo.height + settings.logo.margins.bottom, 
    width: settings.logo.margins.left + logo.width + settings.logo.margins.bottom 
}
   /*
          Add the title's SVG
      */
   const titleSVG = draw
       .text(title.text)
       .font({ fill: title.style.color, family: title.style.fontFamily, size: title.style.fontSize })
       .move(0, 0)
    titleSVG.leading(0)
    const titleDim = {
        height: settings.title.margins.top + title.style.fontSize + settings.title.margins.bottom, 
        width: settings.title.margins.left + titleSVG.rbox(draw).width + settings.title.margins.bottom 
    }
   

   /*
          Add the slogan's SVG
      */
   const sloganSVG = draw
       .text(slogan.text)
       .font({ fill: slogan.style.color, family: slogan.style.fontFamily, size: slogan.style.fontSize })
       .move(0, 0)
    sloganSVG.leading(0)
    const sloganDim = {
        height: settings.slogan.margins.top + slogan.style.fontSize + settings.slogan.margins.bottom, 
        width: settings.slogan.margins.left + sloganSVG.rbox(draw).width + settings.slogan.margins.bottom 
    }

    // the elements are vertically stacked,
    // so the width of the container is equal with the width of the largest element
    // and the height is the sum of all the element's height
    const widthContainer = logo.width + Math.max( titleDim.width, sloganDim.width)
    const heightContainer = Math.max(logoDim.height, titleDim.height + sloganDim.height)
    const cx = widthContainer / 2
    const cy = heightContainer / 2

    const textContainerWidth = Math.max(titleDim.width, sloganDim.width)
    const textContainerHeight = titleDim.height + sloganDim.height
    const ctx = textContainerWidth / 2
    const cty = textContainerHeight / 2

    logoSVG.move(textContainerWidth, cy - logoDim.height / 2)
    titleSVG.move(ctx - titleDim.width / 2, cy - (cty - titleDim.height / 2) - titleDim.height / 2)
    sloganSVG.move(ctx - sloganDim.width / 2, cy + (cty - sloganDim.height / 2) - sloganDim.height / 2 + (titleSVG.rbox(draw).height - titleDim.height) * 0.3)

    const currentViewBox = draw.viewbox()
    
    // AUTOSCAllING
    // check if the current element occupy more than the initial size of the viewbox 
    draw.viewbox(0, 0, currentViewBox.width < widthContainer ? widthContainer + autoScallingOffsetMargin : currentViewBox.width, currentViewBox.height < heightContainer ? heightContainer + autoScallingOffsetMargin : currentViewBox.height)

    return {
        containerPos: {
            x: 0,
            y: 0,
            cx,
            cy,
            width: widthContainer,
            height: heightContainer,
        },
        containerElems: {
            logoSVG,
            titleSVG,
            sloganSVG,
        },
    }
}