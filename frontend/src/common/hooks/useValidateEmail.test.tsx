import { describe, expect, it } from "vitest";
import useValidateEmail from "./useValidateEmail";
import { screen, act, render } from "@testing-library/react";

const TestComponent = ({ email }: { email: string }) => {
  const isValidEmail = useValidateEmail(email);
  return <div>{isValidEmail ? "true" : "false"}</div>;
}

describe("useValidateEmail", () => {
  it("should return false if the email is invalid", () => {
    act(() => {
      render(<TestComponent email="mauvaisemail" />);
    });
    expect(screen.getByText("false")).toBeTruthy();
  });
  it("should return false if the email is valid", () => {
    act(() => {
      render(<TestComponent email="bon.email@exemple.test" />);
    });
    expect(screen.getByText("true")).toBeTruthy();
  });
});
