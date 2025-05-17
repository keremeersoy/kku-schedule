import MaxWidthWrapperWithoutFlex from "@/components/max-width-wrapper-without-flex";
import { Label } from "@/components/ui/label";

const App = () => {
  return (
    <MaxWidthWrapperWithoutFlex>
      <div className="mb-4 flex justify-between">
        <Label className="flex items-center text-xl">dashboard main page</Label>
      </div>
    </MaxWidthWrapperWithoutFlex>
  );
};

export default App;
