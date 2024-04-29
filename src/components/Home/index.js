import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    category: 'ALL',
    projectShowCaseData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectShowCaseData()
  }

  getProjectShowCaseData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {category} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${category}`,
    )
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        imageUrl: eachData.image_url,
      }))
      this.setState({
        projectShowCaseData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {projectShowCaseData} = this.state

    return (
      <ul className="project-showcase-container">
        {projectShowCaseData.map(eachProject => (
          <li className="project-container" key={eachProject.id}>
            <img
              src={eachProject.imageUrl}
              className="project-image"
              alt={eachProject.name}
            />
            <p className="project-name">{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color=" #328af2" width={50} height={50} />
    </div>
  )

  renderFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getProjectShowCaseData}
      >
        Retry
      </button>
    </>
  )

  renderSwitchCondition = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeCategory = event => {
    this.setState({category: event.target.value}, this.getProjectShowCaseData)
  }

  render() {
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="website-logo"
            alt="website logo"
          />
        </nav>
        <div className="responsive-container">
          <select className="dropdown-menu" onChange={this.onChangeCategory}>
            {categoriesList.map(eachCategory => (
              <option
                className="category-name"
                key={eachCategory.id}
                value={eachCategory.id}
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          <div className="main-container">{this.renderSwitchCondition()}</div>
        </div>
      </div>
    )
  }
}

export default Home
