import Navigation from "../../components/navigation";
import HiddenExit from "../../components/hiddenExit";
export default function Layout({ children }) {
  return (
    <>
    <HiddenExit/>
      <header>마르타 프로그램북</header>
      <main>{children}</main>
    </>
  );
}
