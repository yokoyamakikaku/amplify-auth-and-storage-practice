import CreateDocument from "./components/CreateDocument"
import CreateUser from "./components/CreateUser"
import ViewDocuments from "./components/ViewDocuments"
import ViewWelcomeMessage from "./components/ViewWelcomeMessage"

export default function HomePage() {
  return (
    <>
      <ViewWelcomeMessage />
      <CreateDocument />
      <ViewDocuments />
      <CreateUser />
    </>
  )
}
