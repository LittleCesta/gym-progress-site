import { fakerPT_BR as faker } from "@faker-js/faker";
interface NomeCompleto {
    nome: string;
    email: string;
}

interface Medidas {
    peso: number;
    peito: number;
    abdomen: number;
    ombros: number;
    quadricepsEsquerdo: number;
    quadricepsDireito: number;
    panturrilhaEsquerda: number;
    panturrilhaDireita: number;
    bicepsEsquerdo: number;
    bicepsDireito: number;
}

interface Ficha extends NomeCompleto, Medidas {
    data: Date;
}

export function gerarDadosFicticios(totalDePessoas: number = 10, totalDeFichas: number = 2): Ficha[][] {
	const fichas: Ficha[][]	 = [];

	const nomes: NomeCompleto[] = Array.from({ length: totalDePessoas }).map(() => {
		const nome = faker.person.firstName();
		const sobrenome = faker.person.lastName();

		return {
			nome: `${nome} ${sobrenome}`,
			email: faker.internet
				.email({ firstName: nome, lastName: sobrenome })
				.toLowerCase(),
		};
	});

	for (let i = 0; i < nomes.length; i++) {
		const { nome, email } = nomes[i];

		const datas: Date[] = faker.date.betweens({
			from: "2025-08-01T00:00:00.000Z",
			to: "2025-09-01T00:00:00.000Z",
			count: totalDeFichas,
		});

		const ficha: Ficha[] = [];

		for (let j = 0; j < totalDeFichas; j++) {
			const medicoes: Medidas[] = Array.from({ length: nomes.length }).map(() => ({
				peso: faker.number.int({ min: 40, max: 300 }), // kg
				peito: faker.number.int({ min: 50, max: 120 }), // cm
				abdomen: faker.number.int({ min: 50, max: 130 }), // cm
				ombros: faker.number.int({ min: 50, max: 150 }), // cm
				quadricepsEsquerdo: faker.number.int({ min: 50, max: 120 }), // cm
				quadricepsDireito: faker.number.int({ min: 50, max: 120 }), // cm
				panturrilhaEsquerda: faker.number.int({ min: 50, max: 80 }), // cm
				panturrilhaDireita: faker.number.int({ min: 50, max: 80 }), // cm
				bicepsEsquerdo: faker.number.int({ min: 50, max: 70 }), // cm
				bicepsDireito: faker.number.int({ min: 50, max: 70 }), // cm
			}));

			ficha.push({
				nome,
				data: datas[j],
				email,
				...medicoes[j],
			});
		}

		fichas.push(ficha);
	}

	return fichas;
}
