import { Spinner } from "./ui/spinner";

const PageLoader = () => {
    return (
        <div className="h-dvh flex items-center justify-center">
            <Spinner className="text-accent size-14 mb-40 md:mb-20" />
        </div>
    );
}

export default PageLoader;