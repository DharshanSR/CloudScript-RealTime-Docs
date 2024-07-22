import Image from 'next/image'

/**
 * Loader component to show when data is being loaded.
 * It uses an animated SVG image of a loader and a text message "Loading..."
 *
 * @return {JSX.Element} A JSX element representing the loader
 */
const Loader = () => {
  // Render a div with the class name "loader"
  return (
    <div className="loader">
      {/* Display an animated SVG image of a loader 
       * @property {string} src - The source URL of the image
       * @property {string} alt - Alt text for the image
       * @property {number} width - The width of the image
       * @property {number} height - The height of the image
       * @property {string} className - The class name for the image
       */}
      <Image 
        src="/assets/icons/loader.svg"
        alt="loader"
        width={32}
        height={32}
        className="animate-spin"
      />
      {/* Display the text message "Loading..." */}
      Loading...
    </div>
  )
}

export default Loader