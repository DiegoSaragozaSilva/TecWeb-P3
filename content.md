# Handout - End-to-end Machine Learning

### Por Caio Emmanuel e Diego Saragoza

---

Bem-vindo, pythonistas!

Sabemos que o semestre está perto de acabar, mas ainda falta dar aquele último gás para fazer um trabalho fera de Ciência de Dados!

A gente sabe que você tá perdido. A gente sabe. E pra te ajudar e tornar seu semestre mais tranquilo, a gente resolveu fazer esse handout pra te passar umas dicas de como fazer. As partes são independentes, então você pode aprender na ordem que quiser. Vamos começar...

---

### Sumário

1. [Escolha do Dataset](#1-escolha-do-dataset)
2. [Análise Exploratória](#2-análise-exploratória)
3. [Modelos](#3-modelos)
   - [3.1. Modelos de Regressão](#31-modelos-de-regressão)
   - [3.2. Modelos de Classificação](#32-modelos-de-classificação)
4. [Métricas](#4-métricas)
5. [Uma boa conclusão](#5-uma-boa-conclusão)

---

### 1. Análise Exploratória

O foco aqui não é te ensinar ou fazer uma revisão daquela análise exploratória que você aprende lááááá no começo com aqueles tutoriais de pandas, não!

Se você quer fazer um trabalho impressionante de dados, seja na faculdade ou no trabalho, você deve saber contar uma história com seus dados e a linguagem para contar essa história é uma boa análise exploratória, carregada de gráficos que empoderem os seus argumentos.

Todo bom trabalho deve começar (e dedicar algumas horas a isso) com uma EDA (Exploratory Data Analysis), em verdade, se feito corretamente a EDA serve como uma validação de que uma base de dados pode realmente ser útil para um modelo, ainda que as métricas pareçam dizer o contrário.

Como diria o filósofo estóico Sêneca:

> O Homem sábio considera a razão de todas suas ações, mas não os resultados.

Mas chega de enrolação!

Escolher o que você quer demonstrar é um passo essencial para sabermos qual o melhor gráfico a fazer. Uma regra de bolso boa a se seguir é essa usada pelo Kaggle:

<img class="align-item-self" src="https://imgur.com/2VmgDnF.png" width="100%">

Vejamos alguns exemplos de uso. O dataset utilizado aqui é o <i>"Orange Telecom's Churn Dataset"</i>, um dataset utilizado para prever a saída de clientes de seus planos telefônicos. Comece lendo esse esse arquivo como um dataframe, você pode ver o nome dele na aba "Files" do cabeçalho.

Façamos um estudo das features quantitativas. Se plotarmos a feature <i>Total Day Minutes</i>, obteremos a seguinte distribuição (pode ser utilizando o método ```.hist()``` do dataframe por agora):

<img class="align-item-self" src="assets/imgs/distribuicao_total_day_minutes.png" width="100%">

Agora é sua vez, descubra quais são todas as variáveis quantitativas e plot em uma única imagem (como subplots) a distribuição destas. <b>Não faça isso plotando uma por vez!</b> Pense na maneira mais ágil de fazê-lo. Você pode conferir as imagens geradas na aba "Variables".

Pra isso você deve usar o [distplot](https://seaborn.pydata.org/generated/seaborn.distplot.html) do seaborn, pesquise como ele funciona e aplique para todas as variáveis quantitativas.

---

Para estudarmos as variáveis categóricas, como o próprio <i>churn</i>, é conveniente sabermos como esse está distribuído entre os valores que pode assumir. Mas ao invés de usarmos um ```.value_counts()``` insosso que ficará perdido no seu código, vamos utilizar gráficos!

O tipo de gráfico ideal para realizar essa contagem é o [countplot](https://seaborn.pydata.org/generated/seaborn.countplot.html), para o churn que falávamos vamos ter:

<img class="align-item-self" src="assets/imgs/distribuicao_churn.png" width="100%">

Faça o mesmo para as outras variáveis categóricas.

---

É possível criar gráficos muito significativos quando plotamos features quantitativas por outras features quantitativas. É um exemplo o gráfico de correlação, muito útil para saber de antemão quais podem ser as features mais importantes para a modelagem da solução.

Veja a matriz de correlação abaixo, chamamos isso de heatmap.

<img class="align-item-self" src="assets/imgs/matriz_de_corr.png" width="100%">

Ela foi criada da seguinte maneira, com as variáveis que nos interessava:

```
features = list(
    set(df.columns)
    - set(
        [
            "State",
            "International plan",
            "Voice mail plan",
            "Area code",
            "Customer service calls",
        ]
    )
)

corr_matrix = df[features].corr()
sns.heatmap(corr_matrix)
```

Perceba que essa matriz possui uma simetria em relação a sua diagonal, uma vez que a operação de correlação é simétrica em relação às variáveis. Uma maneira de deixar esse gráfico mais <i>clean</i> é aplicar uma máscara sobre o triângulo superior. Procure como criar essa máscara e aplique ela na matriz de correlação criada.

---

Podemos ainda visualizar a distribuição de uma variável quantitativa por outra utilizando o [joinplot](http://seaborn.pydata.org/generated/seaborn.jointplot.html), veja um exemplo:

<img class="align-item-self" src="assets/imgs/jointplot_example.png" width="100%">

Experimente fazer o mesmo para outros pares de variáveis quantitativas, brinque como o parâmetro <i>kde</i> dessa função.

---

Da mesma forma é possível combinar variáveis qualitativas em um mesmo gráfico. Veja alguns exemplos utilizando countplot. Adicionamos o parâmetro <i>hue</i> para adicionar mais uma variável na contagem.

<img class="align-item-self" src="assets/imgs/hue_example.png" width="100%">

---

Por último, é possível ainda combinar features quantitativas e qualitativas e conseguir gráficos ainda mais significativos.

<img class="align-item-self" src="assets/imgs/quant&quali.png" width="100%">

### 2. Modelos

#### 2.1. Modelos de Regressão

#### 2.2. Modelos de Classificação

### 3. Métricas

### 4. Uma boa conclusão
