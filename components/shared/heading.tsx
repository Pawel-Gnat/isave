interface HeadingProps {
  text: string;
}

export const Heading = ({ text }: HeadingProps) => {
  return (
    <h1 className="mb-4 text-center text-2xl font-bold sm:mb-24 sm:mt-1 sm:text-left sm:text-3xl">
      {text}
    </h1>
  );
};
