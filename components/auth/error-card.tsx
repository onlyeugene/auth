import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
// import { Card, CardFooter, CardHeader } from "../ui/card"
// import { BackButton } from "./back-button"
import { CardWrapper } from "./card-wrapper";
// import { Header } from "./header"

export const ErrorCard = () => {
  return (
    // <Card className="w-[400px] shadow-md">
    //     <CardHeader>
    //         <Header label="Oops! Something went wrong"/>
    //     </CardHeader>
    //     <CardFooter>
    //         <BackButton
    //             label="Back to login"
    //             href="/auth/login"
    //         />
    //     </CardFooter>
    // </Card>
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full items-center flex justify-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
