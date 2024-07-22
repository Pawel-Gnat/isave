import { FC } from 'react';

interface HeadingProps {
  text: string;
}

export const Heading: FC<HeadingProps> = ({ text }) => {
  return <h1 className="mb-4 mt-1 text-2xl font-bold sm:mb-24 sm:text-3xl">{text}</h1>;
};
