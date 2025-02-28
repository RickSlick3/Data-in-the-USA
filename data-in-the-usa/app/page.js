import Image from "next/image";

export default function Home() {
  return (
    <div className="leading-[1.5] max-w-7xl">
      <h1 className="text-5xl font-bold mb-4">Health is Wealth</h1>

      <p className='text-s my-1'>Source code and documentation can be found at <a className="underline text-blue-700 font-bold" href='https://github.com/RickSlick3/Data-in-the-USA' target="_blank">this GitHub repository</a>.</p>
      <p className='text-xs my-4'><strong>Preface: </strong>The dashboard was not made to be responsive to page size. The dashboard was ideally created for a screen of width 1600px, and a height of no less than 850px.</p>

      <p className="my-1 indent-8">This web application was created to provide an interactive platform for exploring the relationship between economic status and health outcomes across U.S. counties. The dashboard allows users to navigate linked visualizations—a choropleth map, scatterplot, and histogram—that provide a multidimensional view of the data. Interactions such as hovering and clicking allow users to highlight specific counties, observe cross-visualization relations, and gain deeper insights into the distribution of data attributes. Ultimately, the application highlights the trend that counties with the lowest incomes often experience the highest rates of health issues. </p>
      <p className="my-2 font-bold">Watch the full application demonstration <a className="underline text-blue-700" href="https://www.loom.com/share/91b07b0d3527458caec998fae96e86c2" target="_blank"><strong>here</strong></a>.</p>

      <Image src="/map_sample.png" alt="choropleth map" layout="intrinsic" width="1000" height="425"/>

      <h2 className="text-3xl font-bold my-4">From Data to Insights</h2>
      
      <h3 className="text-2xl font-bold my-4">The Dataset</h3>
      <p className="my-1 indent-8">This web application uses data from <a className="underline text-blue-700" href="https://www.cdc.gov/heart-disease-stroke-atlas/about/?CDC_AAref_Val=https://www.cdc.gov/dhdsp/maps/atlas/index.htm" target="_blank">the CDC's Atlas of Heart Disease and Stroke</a>. This data provides a U.S. county-level collection of economic and health statistics in one CSV file. Each row in the data includes:</p>
      <ol className="my-4 ml-8">
        <li>1. A unique 5-digit FIPS (Federal Information Processing Standard) code to identify the U.S. county</li>
        <li>2. The corresponding U.S. county and state name</li>
        <li>3. The U.S. county's recorded economic and health statistics expressed as averages and percentages of the population</li>
      </ol>
      <p>The full dataset can be downloaded by <a className="underline text-blue-700" href="/national_health_data_2024.csv" download>clicking here</a>.</p>
    
      <h3 className="text-2xl font-bold my-4">Design Decisions</h3>
      <p className="my-1 indent-8">The dashboard was designed with ease-of-use and clarity in mind. The visualizations are intended to reveal more than just basic correlations and distributions.</p> 
      <p className="my-1 indent-8">The color green was chosen for the visuals because it represents life, growth, health and money. The choropleth map employs a linear color scale—from bright green to black—to illustrate county-level differences. Black was selected because it can symbolize death or loss, aligning with the health attributes under analysis.</p> 
      <p className="my-1 indent-8">Both the scatterplot and choropleth map scales start at zero and extend to the highest observed value for each attribute. This design choice emphasizes health metrics with higher average percentages. On the choropleth map, counties rendered in lighter green indicate lower averages, while darker shades reflect higher averages.</p> 
      <p className="my-1 indent-8">Attributes are changed by clicking buttons rather than using a dropdown menu, enabling users to swiftly switch between attributes and observe relationships or similarities.</p> 
      <p className="my-1 indent-8">The choropleth map is intended as the dashboard’s primary focus. Because it is more challenging to interpret at smaller sizes, it is given the largest display area on the page. Although spatial distribution is a key aspect of the data, the other visualizations simply require less space to effectively convey their information.</p> 

      <h3 className="text-2xl font-bold my-4">The Visuals and Interactivity</h3>

      <Image src="/full-dashboard.png" alt="full dashboard" layout="intrinsic" width="1000" height="425"/>

      <p className="my-1 indent-8">The dashboard page includes interactive legends that allow you to view different health and wealth attributes. <strong>You can change these attributes</strong> by clicking on any of the several selections provided in the health and wealth rows near the top of the page. When new selections are made, the points and/or scales will update for the selected data. Interactions are cross-linked: selecting new attributes can update one or more of the visuals, and hovering over or clicking an element in one view triggers updates in the others.</p>
      
      <Image src="/interactive-example.png" alt="interactivity example" layout="intrinsic" width="1000" height="425"/>
      
      <p className="my-1 indent-8">The visualization component of our application is divided into three interrelated views, each offering a different perspective on the data:</p>

      <h4 className="text-xl font-bold my-4">Scatterplot</h4>
      <p className="my-1 indent-8">The scatterplot shows the relationship between an economic attribute on the x-axis and a health attribute on the y-axis. Each point represents a county's intersection of the two attributes.</p>
      <p className="my-1 indent-8">While hovering over the scatterplot, tooltips appear to provide the U.S. county, state abbreviation, and exact values of each of the selected attributes for that county. Hovering also shows the corresponding county on the choropleth map and the histogram bin the county falls into by coloring them orange.</p>

      <h4 className="text-xl font-bold my-4">Histogram</h4>
      <p className="my-1 indent-8">The histogram shows the distribution of a selected health attribute. Each bar represents a bin of counties with values that fall between the indicated domain on the x-axis.</p>
      <p className="my-1 indent-8">When you hover over a bar, a tooltip appears to provide the bar's domain of values and how many counties fit in that domain. The corresponding counties are also highlighted orange in the choropleth map and scatterplot, making it easier to see how different segments of the data are distributed geographically. Clicking a bar locks in that selection and dulls the color of all other counties on the choropleth map. Multiple selections can be made, allowing for a more focused geographical view of the selected sections of the data.</p>

      <h4 className="text-xl font-bold my-4">Choropleth Map</h4>
      <p className="my-1 indent-8">The choropleth map shows each U.S. county, colored according to the value of the selected health attribute. The gradient color scale conveys the percent of the population, while the legend clarifies the mapping between color and value.</p>
      <p className="my-1 indent-8">Hovering over a county reveals a tooltip with information about the selected health or wealth attribute, and highlights the corresponding bin and point in the other visualizations. Clicking on a county dulls the color of all other counties on the choropleth map. Multiple selections can be made, allowing for a more focused geographical view of the selected counties.</p>

      <h3 className="text-2xl font-bold my-4">Outcomes</h3>
      <p className="my-1 indent-8">The application enables you to uncover the complex relationship between economic status and health outcomes across U.S. counties. The user can discover how lower income levels are associated with higher incidences of health issues by observing correlations in the scatterplot, see how these patterns are distributed geographically, revealing regional disparities and hotspots where economic challenges and poor health outcomes intersect, or understand the distribution of health attributes across counties, showing you which ranges hold the average values. </p>
      
      <h3 className="text-2xl font-bold my-4">Sample Findings</h3>
      <p className="my-1 indent-8">By selecting specific health and wealth attributes, the user can assess the correlation of the attributes and identify outliers in the scatterplot.</p>
      
      <Image src="/stroke-scatterplot.png" alt="stroke scatterplot" layout="intrinsic" width="425" height="425"/>
      
      <p className="my-1 indent-8">The user can also see the distribution of the selected health attribute in the histogram to determine averages.</p>
      
      <Image src="/high-bp-histogram.png" alt="high bp histogram" layout="intrinsic" width="500" height="425"/>
      
      <p className="my-1 indent-8">By clicking on bars in the histogram, the user can identify geographical trends, such as which regions have the highest populations of smokers. </p>

      <Image src="/smoking-choropleth.png" alt="smoking choropleth" layout="intrinsic" width="1000" height="425"/>

      <h2 className="text-3xl font-bold my-4">Application Development</h2>

      <h3 className="text-2xl font-bold my-4">Frameworks and Libraries</h3>
      <p className="my-1 indent-8">This web application was built using <a className="underline text-blue-700" href="https://nextjs.org/" target="_blank">Next.js</a>, <a className="underline text-blue-700" href="https://www.javascript.com/" target="_blank">JavaScript</a>, <a className="underline text-blue-700" href="https://d3js.org/" target="_blank">D3</a>, and styled with <a className="underline text-blue-700" href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a>. On the dashboard page, the `useEffect` hook is the starting point for our dashboard’s initialization and interaction logic. It loads and preprocesses the data, then creates three separate D3 visualizations. The hook also establishes event listeners and callbacks so that user actions, like hovering or clicking on one view, trigger coordinated updates across all components.</p>

      <p className="my-1 font-bold">The source code can be downloaded and locally run using <a className="underline text-blue-700" href="https://github.com/RickSlick3/Data-in-the-USA/tree/main/data-in-the-usa" target="_blank">these instructions</a>.</p>

      <h3 className="text-2xl font-bold my-4">Challenges and Future Improvements</h3>

      <p className="my-1 font-bold">Color Scaling and Consistent Scales:</p>
      <p className="my-1 indent-8 ml-8">As of now, the scales on my choropleth map range from zero to the maximum value of an attribute. This because an issue when comparing attributes. For example, if the highest percent for attribute 1 was 10%, but the average was between 9-10%, the map would be primarily dark. If the highest percent for attribute 2 was 50%, and th average was 45%, this map would also be primarily dark. Despite the difference between a maximum of 10% and 50% of the population, both of these maps would look similar in color. I would like to find a way to make this more comparable while also maintaining the range of colors on a single map.</p>
      <p className="my-1 indent-8 ml-8">Unlike the map, there is no color variation in my scatterplot or my histogram. I would like to add a linear color scale to these plots to also highlight the range of the selected health attribute. Or else, this color could also highlight an additional attribute from the data to add more dimensions to my analysis.</p>
      
      <p className="my-1 font-bold">Problems with Interactions</p>
      <p className="my-1 indent-8 ml-8">In my development, I did not handle the state of the county selections in a sophisticated way. When clicking a bar in the histogram, switching attributes, and clicking a bar in the new histogram, some states seem to remain selected from the previous map even though they get recolored. This can lead to unintended consequences and may require the user to refresh the page to reset the selections. This should be fixed to improve user experience and maintain consistency between the visualizations. </p>
      <p className="my-1 indent-8 ml-8">Linking these visuals was done using call-backs and adds complexity to my code for others who view it. While making these improvements, I must attempt to try and minimize the amount of call-backs and function chaining to avoid call-back hell and maintain ease of understanding. </p>

      <p className="my-1 font-bold">More Visualization of Economic Attributes</p>
      <p className="my-1 indent-8 ml-8">There are currently two buttons above the choropleth map, median household income and poverty percent, that when clicked show the geographical distribution of the selected economic attribute. I would also like to provide this data on the histogram, use a different color on both the map and histogram to indicate that I am showing an economic attribute rather than a health attribute.</p>


      <h3 className="text-2xl font-bold my-4">Use of Artificial Intelligence Tools</h3>

      <p className="my-1 font-bold">Framework and Page Setup</p>
      <p className="my-1 indent-8 ml-8">I am still relatively new to working with Next.js and sometimes have trouble understanding its full architecture. ChatGPT has been an excellent tool for explaining how to start working with new technologies and getting off the ground quickly. By writing descriptive prompts detailing how I want my application’s architecture to be set up, ChatGPT can cover all the explanations and setup instructions in a fraction of the time it would take to read the official documentation.</p>

      <p className="my-1 font-bold">Error Fixes</p>
      <p className="my-1 indent-8 ml-8">Often, errors that arise when using multiple components and imports can be difficult to track down. With ChatGPT, I can have errors explained, understood, and traced back to their source rapidly.</p>

      <p className="my-1 font-bold">Learning D3</p>
      <p className="my-1 indent-8 ml-8">Similar to GitHub Copilot, ChatGPT is a fantastic tool for explaining each line of code when working with a new library or framework. Using in-class examples of different visualizations, ChatGPT can read entire files and add clarifying comments to explain the purpose of each function or method. This reduces the learning curve and allows for quicker development, as well as enabling me to correctly prompt ChatGPT for assistance.</p>

      <p className="my-1 font-bold">Advanced Interactivity (Callbacks)</p>
      <p className="my-1 indent-8 ml-8">In my dashboard, I decided to link my three different visualizations together interactively. ChatGPT guided me through the method I used to do this and continuously explained which functions or callbacks were connected.</p>

      <p className="my-1 font-bold">Styling</p>
      <p className="my-1 indent-8 ml-8">Tailwind CSS makes styling very easy, especially when advanced styles or animations are not needed. Using Tailwind CSS to style my HTML allows easier editing with ChatGPT since I don't have to manage CSS files or worry about corresponding classes as much.</p>
    </div>
  );
}
