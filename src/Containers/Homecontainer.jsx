import React from "react";
import { Filters, MainSpinner } from "../Components";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import TemplateDesignPin from "../Components/TemplateDesignPin";

function Homecontainer() {
  const {
    data: templates,
    isError: temp_isError,
    isLoading: temp_isLoading,
    refetch: temp_refetch,
  } = useTemplates();

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full px-4 lg:px-12 py-6 flex flex-col  items-center justify-start">
      {/* { filter section} */}
      <Filters />

      {/* Render those templates */}
      {temp_isError ? (
        <React.Fragment>
          <p>Something went wrong..Please try </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <RenderATemplate templates={templates} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesignPin
                  key={template?._id}
                  data={template}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>NO DATA FOUND</p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Homecontainer;
