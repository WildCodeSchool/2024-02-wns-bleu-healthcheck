import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../pages/home/Home";
import { test, expect } from "vitest";

import { MockedProvider } from "@apollo/client/testing";
import { TEST_URL } from "@/common/graphql/queries";

const mocks = [
  {
    request: {
      query: TEST_URL,
      variables: {},
    },
    result: {
      data: {
        testUrl: {
          url: "http://example.com",
          status: {
            date: "2024-01-01",
            response_time: 200,
            status: 2,
            status_code: 200,
            status_message: "Success",
          },
        },
      },
    },
  },
];

test("renders the main title", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Home />
    </MockedProvider>
  );
  const titleElement = screen.getByText(/LA NOUVELLE ÈRE DU DASHBOARDING/i);
  expect(titleElement).toBeInTheDocument();
});
