
export async function getData(url: string): Promise<any> {

    const response = await fetch(url);
    const result = await response.json();

    return result;

}
