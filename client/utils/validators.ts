export const required = (value: string) => {
    return !!value || "This input is required"
}